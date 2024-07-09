import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { Concert, DB } from '../infra/database/types';
import { InjectDatabase } from '../infra/database/di-tokens';
import { ConcertSeatsEntity } from './domain/concert-seats.entity';

export type TransactionalHook = (
  trx: Transaction<DB>,
  model: Concert,
) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async saveAndSerialize(concert: ConcertAggregate) {
    const concertModel: Concert = {
      id: concert.id,
      title: concert.title,
      seats: JSON.stringify(concert.seatsEntity.seats),
    };

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
        await this.transactionalHook?.(trx, concertModel);
        return;
      }

      await trx
        .insertInto('concerts')
        .values({ ...concertModel })
        .execute();
      await this.transactionalHook?.(trx, concertModel);
    });
  }

  public async getByIdAndDeserialize(id: string) {
    const concertModel = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return concertModel
      ? new ConcertAggregate(
          concertModel.id,
          concertModel.title,
          new ConcertSeatsEntity(JSON.parse(concertModel.seats)),
        )
      : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
