import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { Subject } from 'rxjs';
import { Orders, Prisma, StatusOrder } from '../../generated/prisma/client';

@Injectable()
export class OrdersService {
  private channels = new Map<string, Subject<Orders>>();

  constructor(private prisma: PrismaService) {}

  private getChannel(slug: string): Subject<Orders> {
    if (!this.channels.has(slug)) {
      this.channels.set(slug, new Subject<Orders>());
    }
    return this.channels.get(slug)!;
  }

  async create(slug: string, createOrderDto: CreateOrderDto) {
    const { guest_name, total, supplies, order_id, order_type } =
      createOrderDto;

    const admin = await this.prisma.users.findUnique({
      where: { slug },
    });

    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The admin with slug "${slug}" does not exist`,
      });
    }

    const order = await this.prisma.$transaction(async (tx) => {
      let currentOrder;

      const supplyIds = [...new Set(supplies.map((s) => s.id))];

      await this.validateSupplies(tx, admin.id, supplies, supplyIds);

      if (order_id) {
        const findOrder = await tx.orders.findUnique({
          where: { id: order_id },
        });

        if (!findOrder) {
          throw new NotFoundException({
            code: 'ORDER_NOT_FOUND',
            message: `The order with ID ${order_id} does not exist`,
          });
        }

        currentOrder = await tx.orders.update({
          where: { id: order_id },
          data: {
            total: { increment: total },
          },
        });
      } else {
        currentOrder = await tx.orders.create({
          data: {
            guest_name,
            total,
            admin_id: admin.id,
            order_type: order_type ?? 'LOCAL',
          },
        });
      }

      const existingSuppliesOrder = await tx.suppliesOrders.findMany({
        where: {
          order_id: currentOrder.id,
          admin_supply_id: { in: supplyIds },
        },
      });
      const existingMap = new Map(
        existingSuppliesOrder.map((s) => [s.admin_supply_id, s])
      );

      const createSupplieOrder = [];
      const updateSupplieOrder = [];

      for (const supply of supplies) {
        const existing = existingMap.get(supply.id);
        if (existing) {
          updateSupplieOrder.push(
            tx.suppliesOrders.update({
              where: { id: existing.id },
              data: {
                quantity: { increment: supply.quantity },
                observations: supply.observations
                  ? [existing.observations, supply.observations]
                      .filter(Boolean)
                      .join('\n')
                  : existing.observations,
              },
            })
          );
        } else {
          createSupplieOrder.push({
            order_id: currentOrder.id,
            admin_supply_id: supply.id,
            price: supply.price,
            quantity: supply.quantity,
            observations: supply.observations,
          });
        }
      }

      await Promise.all(updateSupplieOrder);
      if (createSupplieOrder.length > 0) {
        await tx.suppliesOrders.createMany({
          data: createSupplieOrder,
        });
      }

      return currentOrder;
    });
    this.getChannel(admin.slug!).next(order);

    return {
      status: HttpStatus.CREATED,
      data: {
        order_id: order.id,
      },
    };
  }
  getOrdersStream(slug: string) {
    return this.getChannel(slug).asObservable();
  }

  private async validateSupplies(
    tx: Prisma.TransactionClient,
    adminId: string,
    supplies: CreateOrderDto['supplies'],
    supplyIds: string[]
  ) {
    const suppliesInDb = await tx.adminSupplies.findMany({
      where: {
        id: { in: supplyIds },
        admin_id: adminId,
      },
      select: {
        id: true,
        price: true,
        status: true,
      },
    });

    const currentMap = new Map(suppliesInDb.map((s) => [s.id, s]));

    for (const supply of supplies) {
      const current = currentMap.get(supply.id);

      if (!current) {
        throw new BadRequestException({
          code: 'SUPPLY_NOT_FOUND',
          message: `The supply with ID ${supply.id} does not exist`,
        });
      }

      if (current.status !== 'AVAILABLE') {
        throw new BadRequestException({
          code: 'SUPPLY_NOT_AVAILABLE',
          message: `The supply with ID ${supply.id} is not available`,
        });
      }

      if (current.price.toNumber() !== supply.price) {
        throw new BadRequestException({
          code: 'SUPPLY_PRICE_MISMATCH',
          message: `The price of supply with ID ${supply.id} does not match`,
        });
      }
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        supplies_orders: {
          include: {
            admin_supply: {
              include: {
                supply: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `The order with ID ${id} does not exist`,
      });
    }

    return {
      status: HttpStatus.OK,
      data: {
        id: order.id,
        guest_name: order.guest_name,
        created_at: order.created_at,
        status: order.status,
        supplies: order.supplies_orders.map((so) => ({
          quantity: so.quantity,
          name: so.admin_supply.supply.name,
          price: so.price.toNumber(),
          observations: so.observations,
        })),
        total: order.total.toNumber(),
        payment_type: order.payment_type,
        order_type: order.order_type,
      },
    };
  }

  async findAll(
    adminId: string,
    page: number = 1,
    status: StatusOrder = 'PENDING'
  ) {
    const limit = 2;
    const startCount = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.orders.findMany({
        where: { admin_id: adminId, status },
        orderBy: [{ created_at: 'desc' }],
        select: {
          id: true,
          guest_name: true,
          status: true,
          order_type: true,
          created_at: true,
          total: true,
          is_confirmed: true,
        },
        skip: startCount,
        take: limit,
      }),
      this.prisma.orders.count({ where: { admin_id: adminId, status } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: HttpStatus.OK,
      data: orders.map((order) => ({
        id: order.id,
        status: order.status,
        guest_name: order.guest_name,
        order_type: order.order_type,
        created_at: order.created_at,
        is_confirmed: order.is_confirmed,
        total: order.total.toNumber(),
      })),
      counts: {
        pending: await this.prisma.orders.count({
          where: { admin_id: adminId, status: 'PENDING' },
        }),
      },
      metadata: {
        pagination: {
          total,
          totalPages,
          page,
        },
      },
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, adminId: string) {
    const { status, payment_type, order_type } = updateOrderDto;

    const existingOrder = await this.prisma.orders.findUnique({
      where: { id, admin_id: adminId },
    });

    if (!existingOrder) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `The order with ID ${id} does not exist`,
      });
    }

    await this.prisma.orders.update({
      where: { id },
      data: {
        status,
        payment_type,
        order_type,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        ok: true,
      },
    };
  }

  async confirm(
    id: string,
    { is_confirmed }: ConfirmOrderDto,
    adminId: string
  ) {
    const existingOrder = await this.prisma.orders.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `The order with ID ${id} does not exist`,
      });
    }

    await this.prisma.orders.update({
      where: { id, admin_id: adminId },
      data: { is_confirmed },
    });

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }

  async delete(id: string) {
    const existingOrder = await this.prisma.orders.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `The order with ID ${id} does not exist`,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.suppliesOrders.deleteMany({
        where: { order_id: id },
      });
      await tx.orders.delete({
        where: { id },
      });
    });

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }
}
