import { ReservationQueries } from '../reservation.queries';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReserveSeatDto } from './dto/reserve-seat.dto';
import { ReservationCommandBus } from '../reservation.command-bus';
import { ReserveSeatCommand } from '../commands/reserve-seat.command';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationQueries: ReservationQueries,
    private readonly reservationCommandBus: ReservationCommandBus,
  ) {}

  @Post('concerts/:concertId/reserve')
  public async reserveSeat(@Param('concertId') concertId: string, @Body() body: ReserveSeatDto) {
    await this.reservationCommandBus.send(new ReserveSeatCommand({ concertId, seatNumber: body.seatNumber }));
  }

  @Get('concerts/:concertId/available-seats')
  public async getAvailableSeats(@Param('concertId') concertId: string) {
    return await this.reservationQueries.getAvailableSeats(concertId);
  }
}
