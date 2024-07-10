import { Module } from '@nestjs/common';
import { EventsRepo } from './events.repo';
import { EventManagementService } from './event-management.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  providers: [EventsRepo, EventManagementService],
  imports: [ReservationModule],
})
export class EventManagementModule {}
