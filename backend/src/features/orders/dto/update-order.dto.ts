import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusOrder } from '../../../generated/prisma/enums';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsEnum(StatusOrder)
  status!: StatusOrder;
}
