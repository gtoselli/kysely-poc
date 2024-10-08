import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ReservationQueries } from './reservation.queries';
import { AvailableSeatsRepo } from './available-seats.repo';
import { ReservationController } from './api/reservation.controller';
import { ConcertCreatedEventHandler } from './events/concert-created.event-handler';
import { ReservationCommandBus } from './reservation.command-bus';
import { ReserveSeatCommandHandler } from './commands/reserve-seat.command-handler';
import { CreateReservationConcertCommandHandler } from './commands/create-reservation-concert.command-handler';

@Module({
  providers: [
    ReservationQueries,
    ConcertsRepo,
    AvailableSeatsRepo,
    ConcertCreatedEventHandler,
    ReservationCommandBus,
    ReserveSeatCommandHandler,
    CreateReservationConcertCommandHandler,
  ],
  controllers: [ReservationController],
})
export class ReservationModule {}
