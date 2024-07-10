import { Module } from '@nestjs/common';
import { EventsRepo } from './events.repo';
import { EventsService } from './events.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  providers: [EventsRepo, EventsService],
  imports: [ReservationModule],
})
export class EventManagementModule {}
