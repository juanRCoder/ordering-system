import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LayoutType } from '../../../generated/prisma/enums';

export class CreateTypeSupplyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(LayoutType)
  layout?: LayoutType;
}
