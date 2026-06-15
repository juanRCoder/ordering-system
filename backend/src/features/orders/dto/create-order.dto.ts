import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
}
