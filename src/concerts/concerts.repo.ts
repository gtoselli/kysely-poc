import { Database, InjectDatabase } from '../infra/database.module';
import { Kysely, Transaction } from 'kysely';
import { ConcertModel } from './concerts.service';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';

export type TransactionalHook = (trx: Transaction<Database>) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

  public async saveAndSerialize(concert: ConcertAggregate) {
    const concertModel: ConcertModel = { id: concert.id, title: concert.title };

    await this.database.transaction().execute(async (trx) => {
      const exists = await trx
        .selectFrom('concerts')
        .where('id', '=', concertModel.id)
        .select('id')
        .executeTakeFirst();

      if (exists) {
        await trx
          .updateTable('concerts')
          .set({ ...concertModel })
          .where('id', '=', concertModel.id)
          .execute();
        await this.transactionalHook?.(trx);
        return;
      }

      await trx
        .insertInto('concerts')
        .values({ ...concertModel })
        .execute();
      await this.transactionalHook?.(trx);
    });
  }

  public async getByIdAndDeserialize(id: string) {
    const result = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return result ? new ConcertAggregate(result.id, result.title) : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
