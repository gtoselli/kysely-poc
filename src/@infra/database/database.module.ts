import { Global, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from './types';
import { DatabaseMigrator } from './database.migrator';
import { getDatabaseToken, InjectDatabase } from './di-tokens';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: getDatabaseToken(),
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');

        const dialect = new PostgresDialect({
          pool: new Pool({ connectionString: configService.getOrThrow('DB_CONNECTION_STRING') }),
        });

        return new Kysely<DB>({
          dialect,
          log(event) {
            if (event.level === 'query') {
              logger.debug(
                `Query ${event.query.sql} ${event.query.parameters} executed in ${event.queryDurationMillis.toFixed(2)}ms`,
              );
            } else if (event.level === 'error') {
              logger.error(event.error);
            }
          },
        });
      },
      inject: [ConfigService],
    },
    DatabaseMigrator,
  ],
  exports: [getDatabaseToken()],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@InjectDatabase() private readonly db: Kysely<DB>) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
