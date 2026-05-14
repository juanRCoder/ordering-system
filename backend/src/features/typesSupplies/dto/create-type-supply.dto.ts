import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeSupplyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
