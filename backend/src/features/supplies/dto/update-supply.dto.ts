import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSupplyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
