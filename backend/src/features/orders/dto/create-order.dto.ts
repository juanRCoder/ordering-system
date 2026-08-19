import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SupplyItemDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupplyItemDto)
  supplies!: SupplyItemDto[];

  @IsNotEmpty()
  @IsString()
  guest_name!: string;

  @IsNotEmpty()
  @IsNumber()
  total!: number;

  @IsOptional()
  @IsString()
  order_id?: string;

  @IsOptional()
  @IsString()
  order_type?: 'LOCAL' | 'TAKEAWAY';
}
