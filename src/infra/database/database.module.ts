import { Global, Logger, Module } from '@nestjs/common';
import { Kysely, SqliteDialect } from 'kysely';
import * as SQLite from 'better-sqlite3';
import { DB } from './types';
import { DatabaseMigrator } from './database.migrator';
import { DI_DATABASE_TOKEN, DI_DATABASE_URI_TOKEN } from './di-tokens';

@Global()
@Module({
  imports: [],
  providers: [
    { provide: DI_DATABASE_URI_TOKEN, useValue: 'dev.db' },
    {
      provide: DI_DATABASE_TOKEN,
      useFactory: async (databaseUri: string) => {
        const logger = new Logger('DatabaseModule');

        const dialect = new SqliteDialect({
          database: new SQLite(databaseUri),
        });

        return new Kysely<DB>({
          dialect,
          log(event) {
            if (event.level === 'query') {
              logger.debug(`${event.query.sql}  ${event.query.parameters}`);
            } else if (event.level === 'error') {
              logger.error(event.error);
            }
          },
        });
      },
      inject: [DI_DATABASE_URI_TOKEN],
    },
    DatabaseMigrator,
  ],
  exports: [DI_DATABASE_TOKEN],
})
export class DatabaseModule {}
