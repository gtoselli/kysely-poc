import { Module } from '@nestjs/common';
import { ConcertsRepo } from './concerts.repo';

@Module({
  providers: [ConcertsRepo],
})
export class ConcertsModule {}
