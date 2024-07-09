import { Global, Inject, Module } from '@nestjs/common';
import { Kysely, SqliteDialect } from 'kysely';
import * as SQLite from 'better-sqlite3';
import { Concert } from '../../prisma/generated/types';

const DATABASE_TOKEN = 'DATABASE';
export const InjectDatabase = () => Inject(DATABASE_TOKEN);

export interface Database {
  concerts: Concert;
}

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

        return new Kysely<Database>({
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
