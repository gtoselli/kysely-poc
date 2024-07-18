import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ReservationService } from './reservation.service';
import { AvailableSeatsRepo } from './available-seats.repo';
import { CommunicationModule } from '../communication/communication.module';
import { ReservationController } from './api/reservation.controller';
import { ConcertCreatedEventHandler } from './events/concert-created.event-handler';

@Module({
  providers: [ReservationService, ConcertsRepo, AvailableSeatsRepo, ConcertCreatedEventHandler],
  exports: [ReservationService],
  imports: [CommunicationModule],
  controllers: [ReservationController],
})
export class ReservationModule {}
