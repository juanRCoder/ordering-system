import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTypeSupplyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
