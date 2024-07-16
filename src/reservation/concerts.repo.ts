import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { DB, InjectDatabase, ReservationConcert } from '../@infra';
import { ConcertSeatsEntity } from './domain/concert-seats.entity';

export type TransactionalHook = (trx: Transaction<DB>, model: ReservationConcert) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async saveAndSerialize(concert: ConcertAggregate, transaction?: Transaction<DB>) {
    const concertModel: ReservationConcert = {
      id: concert.id,
      seats: JSON.stringify(concert.seatsEntity.seats),
      _version: concert.version + 1,
    };

    const upsertAndRunTransactionalHook = async (trx: Transaction<DB>) => {
      const result = await trx
        .insertInto('reservation__concerts')
        .values(concertModel)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet(concertModel).where('reservation__concerts._version', '=', concert.version),
        )
        .execute();

      if (result?.[0].numInsertedOrUpdatedRows === 0n) {
        if (concert.version === 0) throw new Error(`Cannot save aggregate ${concert.id} due duplicated id`);
        throw new Error(`Cannot save aggregate ${concert.id} due optimistic lock`);
      }

      await this.transactionalHook?.(trx, concertModel);
    };

    await (transaction
      ? upsertAndRunTransactionalHook(transaction)
      : this.database.transaction().execute(upsertAndRunTransactionalHook));
  }

  public async getByIdAndDeserialize(id: string) {
    const concertModel = await this.database
      .selectFrom('reservation__concerts')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return concertModel
      ? new ConcertAggregate(
          concertModel.id,
          new ConcertSeatsEntity(JSON.parse(concertModel.seats)),
          concertModel._version,
        )
      : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
