import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { supplies, observations, guest_name, total } = createOrderDto;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          guest_name,
          observations,
          total,
        },
      });

      const supplyOrderData = supplies.map((supply) => ({
        order_id: newOrder.id,
        supply_id: supply.id,
        price: supply.price,
        quantity: supply.quantity,
      }));

      await tx.suppliesOrders.createMany({
        data: supplyOrderData,
      });

      return newOrder;
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        id: order.id,
      },
    };
  }

  async findAll() {
    const orders = await this.prisma.orders.findMany({
      include: {
        suppliesOrders: {
          include: {
            supply: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: HttpStatus.OK,
      data: orders.map((order) => ({
        id: order.id,
        guest_name: order.guest_name,
        created_at: order.createdAt,
        status: order.status,
        supplies: order.suppliesOrders.map((so) => ({
          quantity: so.quantity,
          name: so.supply.name,
          price: so.price.toNumber(),
        })),
        observations: order.observations || null,
        total: order.total.toNumber(),
      })),
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { status } = updateOrderDto;

    const existingOrder = await this.prisma.orders.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `El pedido con ID ${id} no existe`,
      });
    }

    await this.prisma.orders.update({
      where: { id },
      data: {
        status,
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
