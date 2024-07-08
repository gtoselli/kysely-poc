import { Database, InjectDatabase } from '../infra/database.module';
import { Kysely } from 'kysely';
import { nanoid } from 'nanoid';

export class ConcertsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

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
