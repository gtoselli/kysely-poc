import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';
import { ConcertsService } from './concerts.service';

@Module({
  providers: [ConcertsService, ConcertsRepo],
})
export class ConcertsModule {}
