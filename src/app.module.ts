import { Module } from '@nestjs/common';
import { ConfigModule, DatabaseModule, EventBusModule } from '@infra';
import { ReservationModule } from './reservation/reservation.module';
import { ManagementModule } from './management/management.module';
import { CommunicationModule } from './communication/communication.module';

@Module({
  imports: [ConfigModule, DatabaseModule, EventBusModule, ReservationModule, ManagementModule, CommunicationModule],
})
export class AppModule {}
