import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReserveSeatDto {
  @IsNumber()
  @IsNotEmpty()
  seatNumber: number;
}
