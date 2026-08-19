import { IsBoolean } from 'class-validator';

export class ConfirmOrderDto {
  @IsBoolean()
  is_confirmed!: boolean;
}
