import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ManagementService } from './management.service';
import { ManagementController } from './api/management.controller';
import { CreateConcertCommandHandler } from './commands/create-concert.command-handler';
import { ManagementCommandBus } from './management.command-bus';
import { UpdateConcertCommandHandler } from './commands/update-concert.command-handler';

@Module({
  providers: [
    ManagementCommandBus,
    ConcertsRepo,
    ManagementService,
    CreateConcertCommandHandler,
    UpdateConcertCommandHandler,
  ],
  controllers: [ManagementController],
})
export class ManagementModule {}
