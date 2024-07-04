import { Database, InjectDatabase } from '../infra/database.module';
import { Generated, Kysely } from 'kysely';
import { nanoid } from 'nanoid';
import { OnModuleInit } from '@nestjs/common';

export interface ConcertTable {
  id: Generated<string>;
  title: string;
}

export class ConcertsRepo implements OnModuleInit {
  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

  async onModuleInit() {
    await this.database.schema
      .createTable('concerts')
      .addColumn('id', 'varchar')
      .addColumn('title', 'varchar')
      .execute();
  }

  public async addOne(title: string) {
    const id = nanoid();
    await this.database.insertInto('concerts').values({ id, title }).execute();

    return { id };
  }

  public async getById(id: string) {
    const results = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .execute();

    return results.length ? results[0] : null;
  }
}
