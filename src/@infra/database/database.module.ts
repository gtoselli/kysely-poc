import { Global, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { getDatabaseToken, InjectDatabase } from './di-tokens';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Database } from '@infra/database/types';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: getDatabaseToken(),
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');

        const datasourceUrl = configService.getOrThrow('DB_CONNECTION_STRING');
        logger.debug(`Starting prisma on ${configService.getOrThrow('DB_CONNECTION_STRING')}`);

        const prismaClient = new PrismaClient({
          datasourceUrl,
          log: [
            {
              emit: 'event',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ],
        });
        prismaClient.$on('query', (e) => {
          if (JSON.stringify(e).includes('outbox')) return;
          logger.debug(`Query ${e.query} ${e.params} executed in ${e.duration.toFixed(2)}ms`);
        });

        return prismaClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [getDatabaseToken()],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@InjectDatabase() private readonly database: Database) {}

  async onModuleDestroy() {
    await this.database.$disconnect();
  }
}
