import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
