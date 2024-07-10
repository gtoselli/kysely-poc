import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ReservationModule } from './reservation/reservation.module';
import { EventManagementModule } from './event-management/event-management.module';

@Module({
  imports: [DatabaseModule, ReservationModule, EventManagementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
