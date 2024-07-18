import { Module } from '@nestjs/common';
import { DatabaseModule } from './@infra';
import { ReservationModule } from './reservation/reservation.module';
import { ManagementModule } from './management/management.module';
import { CommunicationModule } from './communication/communication.module';
import { ConfigModule } from './@infra/config/config.module';
import { EventBusModule } from './@infra/event-bus/event-bus.module';

@Module({
  imports: [ConfigModule, DatabaseModule, EventBusModule, ReservationModule, ManagementModule, CommunicationModule],
})
export class AppModule {}
