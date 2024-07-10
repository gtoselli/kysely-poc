import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ReservationService } from './reservation.service';
import { AvailableSeatsRepo } from './available-seats.repo';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  providers: [ReservationService, ConcertsRepo, AvailableSeatsRepo],
  exports: [ReservationService],
  imports: [CommunicationModule],
})
export class ReservationModule {}
