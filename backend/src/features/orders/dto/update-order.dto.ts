import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  StatusOrder,
  PaymentType,
  OrderType,
} from '../../../generated/prisma/enums';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum(StatusOrder)
  status!: StatusOrder;

  @IsEnum(PaymentType)
  payment_type: PaymentType = PaymentType.CASH;

  @IsEnum(OrderType)
  order_type: OrderType = OrderType.LOCAL;
}
