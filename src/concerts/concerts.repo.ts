import { Database, InjectDatabase } from '../infra/database.module';
import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate, SeatsEntity } from './domain/concert.aggregate';
import { Concert } from '../../prisma/generated/types';

export type TransactionalHook = (trx: Transaction<Database>) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Kysely<Database>) {}

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
    const concertModel = await this.database
      .selectFrom('concerts')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return concertModel
      ? new ConcertAggregate(
          concertModel.id,
          concertModel.title,
          new SeatsEntity(JSON.parse(concertModel.seats)),
        )
      : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
