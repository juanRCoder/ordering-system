import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusOrder, TypePayment } from '../../../generated/prisma/enums';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum(StatusOrder)
  status!: StatusOrder;

  @IsEnum(TypePayment)
  type_pay: TypePayment = TypePayment.CASH;
}
