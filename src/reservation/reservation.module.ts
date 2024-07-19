import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ReservationService } from './reservation.service';
import { AvailableSeatsRepo } from './available-seats.repo';
import { ReservationController } from './api/reservation.controller';
import { ConcertCreatedEventHandler } from './events/concert-created.event-handler';
import { ReservationCommandBus } from './reservation.command-bus';
import { ReserveSeatCommandHandler } from './commands/reserve-seat.command-handler';

@Module({
  providers: [
    ReservationService,
    ConcertsRepo,
    AvailableSeatsRepo,
    ConcertCreatedEventHandler,
    ReservationCommandBus,
    ReserveSeatCommandHandler,
  ],
  controllers: [ReservationController],
})
export class ReservationModule {}
