import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ConfirmOrderDto {
  @IsBoolean()
  @IsNotEmpty()
  is_confirmed!: boolean;
}
