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

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsNotEmpty()
  @IsUUID()
  type_supply_id!: string;

  @IsOptional()
  @IsEnum(StatusSupply)
  status?: StatusSupply;
}
