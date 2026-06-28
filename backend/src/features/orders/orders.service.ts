import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { guest_name, total } = createOrderDto;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          guest_name,
          total,
          admin_id: '80f89d29-c319-4e75-a886-3c8535d0928a',
        },
      });

      // const supplyOrderData = supplies.map((supply) => ({
      //   order_id: newOrder.id,
      //   supply_id: supply.id,
      //   price: supply.price,
      //   quantity: supply.quantity,
      //   observations: supply.observations,
      // }));

      // await tx.suppliesOrders.createMany({
      //   data: supplyOrderData,
      // });

      return newOrder;
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        id: order.id,
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

  async findAll() {
    const orders = await this.prisma.orders.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      status: HttpStatus.OK,
      data: orders.map((order) => ({
        id: order.id,
        guest_name: order.guest_name,
        created_at: order.created_at,
        status: order.status,
        total: order.total.toNumber(),
        order_type: order.order_type,
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
