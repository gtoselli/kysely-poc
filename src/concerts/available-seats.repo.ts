import { InjectDatabase } from '../infra/database.module';
import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';
import { Concert, DB } from '../../prisma/generated/types';

@Injectable()
export class AvailableSeatsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async onConcertSaved(trx: Transaction<DB>, concert: Concert) {
    const seats = JSON.parse(concert.seats) as {
      [key: string]: { occupied: boolean };
    };

    await trx
      .deleteFrom('available_seats')
      .where('concertId', '=', concert.id)
      .execute();

    for (const seatNumber in seats) {
      const occupied = seats[seatNumber].occupied;
      if (occupied) continue;

      await trx
        .insertInto('available_seats')
        .values({
          id: `${concert.id}__${seatNumber}`,
          concertId: concert.id,
          seatNumber: parseInt(seatNumber),
        })
        .execute();
    }
  }

  public async getByConcertId(id: string) {
    return await this.database
      .selectFrom('available_seats')
      .where('concertId', '=', id)
      .selectAll()
      .execute();
  }
}
