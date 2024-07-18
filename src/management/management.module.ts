import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ManagementService } from './management.service';
import { ManagementController } from './api/management.controller';
import { CreateConcertCommandHandler } from './commands/create-concert.command-handler';

@Module({
  providers: [ConcertsRepo, ManagementService, CreateConcertCommandHandler],
  controllers: [ManagementController],
})
export class ManagementModule {}
