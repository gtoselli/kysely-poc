import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';
import { Concert, DB, InjectDatabase } from '../@infra';

@Injectable()
export class AvailableSeatsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async onConcertSaved(trx: Transaction<DB>, concert: Concert) {
    const seats = JSON.parse(concert.seats) as {
      [key: string]: { reserved: boolean };
    };

    await trx.deleteFrom('available_seats').where('concertId', '=', concert.id).execute();

    for (const seatNumber in seats) {
      const reserved = seats[seatNumber].reserved;
      if (reserved) continue;

      await trx
        .insertInto('available_seats')
        .values({
          id: `${concert.id}__${seatNumber}`,
          concertId: concert.id,
          seatNumber: parseInt(seatNumber),
          concertTitle: '',
        })
        .execute();
    }
  }

  public async getByConcertId(id: string) {
    return await this.database.selectFrom('available_seats').where('concertId', '=', id).selectAll().execute();
  }
}
