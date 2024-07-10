import { Module } from '@nestjs/common';
import { DatabaseModule } from './@infra';
import { ReservationModule } from './reservation/reservation.module';
import { ManagementModule } from './management/management.module';
import { CommunicationModule } from './communication/communication.module';

@Module({
  imports: [DatabaseModule, ReservationModule, ManagementModule, CommunicationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
