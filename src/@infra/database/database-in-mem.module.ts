import { Global, Logger, Module } from '@nestjs/common';
import { getDatabaseToken } from './di-tokens';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const TEST_DB_CONNECTION_STRING = 'postgresql://postgres:password@localhost/test';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: getDatabaseToken(),
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');

        const datasourceUrl = TEST_DB_CONNECTION_STRING;
        logger.debug(`Starting prisma on ${datasourceUrl} (test)`);

        execSync(`DB_CONNECTION_STRING="${datasourceUrl}" pnpm exec prisma migrate dev`, {
          stdio: 'inherit',
        });

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
          logger.debug(`Query ${e.query} ${e.params} executed in ${e.duration.toFixed(2)}ms`);
        });

        return prismaClient;
      },
      inject: [],
    },
  ],
  exports: [getDatabaseToken()],
})
export class DatabaseInMemModule {}
