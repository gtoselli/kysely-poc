import { Module } from '@nestjs/common';
import { EventsRepo } from './events.repo';
import { ManagementService } from './management.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  providers: [EventsRepo, ManagementService],
  imports: [ReservationModule],
})
export class ManagementModule {}
