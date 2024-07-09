import { Global, Inject, Module } from '@nestjs/common';
import { Kysely, SqliteDialect } from 'kysely';
import * as SQLite from 'better-sqlite3';
import { DB } from '../../prisma/generated/types';

const DATABASE_TOKEN = 'DATABASE';
export const InjectDatabase = () => Inject(DATABASE_TOKEN);

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DATABASE_TOKEN,
      useFactory: () => {
        const dialect = new SqliteDialect({
          database: new SQLite('dev.db'),
        });

        return new Kysely<DB>({
          dialect,
          log(event) {
            if (event.level === 'query') {
              console.log(event.query.sql, event.query.parameters);
            }
          },
        });
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
