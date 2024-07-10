import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ManagementService } from './management.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  providers: [ConcertsRepo, ManagementService],
  imports: [ReservationModule],
})
export class ManagementModule {}
