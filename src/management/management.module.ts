import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ManagementService } from './management.service';
import { ReservationModule } from '../reservation/reservation.module';
import { ManagementController } from './api/management.controller';

@Module({
  providers: [ConcertsRepo, ManagementService],
  imports: [ReservationModule],
  controllers: [ManagementController],
})
export class ManagementModule {}
