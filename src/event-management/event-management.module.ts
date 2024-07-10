import { Module } from '@nestjs/common';
import { EventsRepo } from './events.repo';
import { EventsService } from './events.service';

@Module({
  providers: [EventsRepo, EventsService],
})
export class EventManagementModule {}
