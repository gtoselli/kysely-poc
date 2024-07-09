import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
