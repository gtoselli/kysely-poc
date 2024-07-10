import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ConcertsService } from './concerts.service';
import { AvailableSeatsRepo } from './available-seats.repo';

@Module({
  providers: [ConcertsService, ConcertsRepo, AvailableSeatsRepo],
  exports: [ConcertsService],
})
export class ReservationModule {}
