import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ReservationService } from './reservation.service';
import { AvailableSeatsRepo } from './available-seats.repo';

@Module({
  providers: [ReservationService, ConcertsRepo, AvailableSeatsRepo],
  exports: [ReservationService],
})
export class ReservationModule {}
