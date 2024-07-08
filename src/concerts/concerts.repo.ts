import { Database, InjectDatabase } from '../infra/database.module';
import { Kysely } from 'kysely';
import { nanoid } from 'nanoid';
import { Concert } from './concerts.service';

export class ConcertsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

  public async addOne(concert: Concert) {
    const id = nanoid();
    await this.database
      .insertInto('concerts')
      .values({ ...concert })
      .execute();

    return { id };
  }

  public async getById(id: string) {
    const results = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .execute();

    return results.length ? (results[0] as Concert) : null;
  }
}
