import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { Database, InjectDatabase, Transaction } from '@infra';
import { ConcertSeatsEntity } from './domain/concert-seats.entity';
import { ReservationConcert } from '@prisma/client';

export type TransactionalHook = (trx: Transaction, model: ReservationConcert) => Promise<void>;

@Injectable()
export class ConcertsRepo {
  private transactionalHook?: TransactionalHook;

  constructor(@InjectDatabase() private readonly database: Database) {}

  public async saveAndSerialize(concert: ConcertAggregate, transaction: Transaction) {
    const concertModel: ReservationConcert = {
      id: concert.id,
      seats: JSON.stringify(concert.seatsEntity.seats),
      version: concert.version + 1,
    };

    const upsertAndRunTransactionalHook = async (trx: Transaction) => {
      const existingAggregate = await transaction.reservationConcert.findUnique({ where: { id: concert.id } });
      if (existingAggregate && existingAggregate.version !== concert.version) {
        if (concert.version === 0) throw new Error(`Cannot save aggregate ${concert.id} due duplicated id`);
        throw new Error(`Cannot save aggregate ${concert.id} due optimistic lock`);
      }

      await transaction.reservationConcert.upsert({
        where: { id: concert.id },
        create: concertModel,
        update: concertModel,
      });

      await this.transactionalHook?.(trx, concertModel);
    };

    await upsertAndRunTransactionalHook(transaction);
  }

  public async getByIdAndDeserialize(id: string, transaction?: Transaction) {
    const concertModel = await (transaction || this.database).reservationConcert.findFirst({ where: { id } });

    return concertModel
      ? new ConcertAggregate(
          concertModel.id,
          new ConcertSeatsEntity(JSON.parse(concertModel.seats)),
          concertModel.version,
        )
      : null;
  }

  public setTransactionalHook(hook: TransactionalHook) {
    this.transactionalHook = hook;
  }
}
