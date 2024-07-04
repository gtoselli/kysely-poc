import { Module } from '@nestjs/common';
import { ConcertsModule } from './concerts/concerts.module';
import { DatabaseModule } from './infra/database.module';

@Module({
  imports: [DatabaseModule, ConcertsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
