import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SupplyItemDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
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
}
