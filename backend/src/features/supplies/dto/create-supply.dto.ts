import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusSupply } from '../../../generated/prisma/enums';

export class CreateSupplyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsUUID()
  category_id!: string;

  @IsOptional()
  @IsEnum(StatusSupply)
  status?: StatusSupply;
}
