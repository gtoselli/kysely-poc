import { Global, Logger, Module } from '@nestjs/common';
import { Kysely, SqliteDialect } from 'kysely';
import { DB, getDatabaseToken } from './index';
import * as SQLite from 'better-sqlite3';
import { DatabaseMigrator } from './database.migrator';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: getDatabaseToken(),
      useFactory: async () => {
        const logger = new Logger('DatabaseModule');

        const dialect = new SqliteDialect({
          database: new SQLite(':memory:'),
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
      inject: [],
    },
    DatabaseMigrator,
  ],
  exports: [getDatabaseToken()],
})
export class DatabaseInMemModule {}
