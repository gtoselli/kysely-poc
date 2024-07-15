import { ReservationService } from '../reservation.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReserveSeatDto } from './dto/reserve-seat.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('concerts/:concertId/reserve')
  public async reserveSeat(@Param('concertId') concertId: string, @Body() body: ReserveSeatDto) {
    await this.reservationService.reserveSeat(concertId, body.seatNumber);
  }

  @Get('concerts/:concertId/available-seats')
  public async getAvailableSeats(@Param('concertId') concertId: string) {
    return await this.reservationService.getAvailableSeats(concertId);
  }
}
