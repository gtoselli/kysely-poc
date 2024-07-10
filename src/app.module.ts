import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ReservationModule } from './reservation/reservation.module';
import { ManagementModule } from './management/management.module';

@Module({
  imports: [DatabaseModule, ReservationModule, ManagementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
