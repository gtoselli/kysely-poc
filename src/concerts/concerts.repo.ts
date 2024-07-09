import { Database, InjectDatabase } from '../infra/database.module';
import { Kysely, Transaction } from 'kysely';
import { Concert } from './concerts.service';
import { Injectable } from '@nestjs/common';

export type TransactionalHook = (trx: Transaction<Database>) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

  public async upsert(concert: Concert) {
    await this.database.transaction().execute(async (trx) => {
      const exists = await trx
        .selectFrom('concerts')
        .where('id', '=', concert.id)
        .select('id')
        .executeTakeFirst();

      if (exists) {
        await trx
          .updateTable('concerts')
          .set({ ...concert })
          .where('id', '=', concert.id)
          .execute();
        await this.transactionalHook?.(trx);
        return;
      }

      await trx
        .insertInto('concerts')
        .values({ ...concert })
        .execute();
      await this.transactionalHook?.(trx);
    });
  }

  public async getById(id: string) {
    const results = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .execute();

    return results.length ? (results[0] as Concert) : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
