import { Global, Inject, Module } from '@nestjs/common';
import { Kysely, SqliteDialect } from 'kysely';
import * as SQLite from 'better-sqlite3';
import { ConcertTable } from '../concerts/concerts.repo';

const DATABASE_TOKEN = 'DATABASE';
export const InjectDatabase = () => Inject(DATABASE_TOKEN);

export interface Database {
  concerts: ConcertTable;
}

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DATABASE_TOKEN,
      useFactory: () => {
        const dialect = new SqliteDialect({
          database: new SQLite(':memory:'),
        });

        return new Kysely<Database>({
          dialect,
        });
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
