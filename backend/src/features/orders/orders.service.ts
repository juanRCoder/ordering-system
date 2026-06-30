import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(slug: string, createOrderDto: CreateOrderDto) {
    const { guest_name, total, supplies } = createOrderDto;

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
      const newOrder = await tx.orders.create({
        data: {
          guest_name,
          total,
          admin_id: admin.id,
        },
      });

      const supplyOrderData = supplies.map((supply) => ({
        order_id: newOrder.id,
        admin_supply_id: supply.id,
        price: supply.price,
        quantity: supply.quantity,
        observations: supply.observations,
      }));

      await tx.suppliesOrders.createMany({
        data: supplyOrderData,
      });

      return newOrder;
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        order_id: order.id,
      },
    };
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

  async findAll(adminId: string) {
    const orders = await this.prisma.orders.findMany({
      where: { admin_id: adminId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        guest_name: true,
        status: true,
        order_type: true,
        created_at: true,
        total: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: orders.map((order) => ({
        id: order.id,
        status: order.status,
        guest_name: order.guest_name,
        order_type: order.order_type,
        created_at: order.created_at,
        total: order.total.toNumber(),
      })),
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { status, payment_type, order_type } = updateOrderDto;

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
}
