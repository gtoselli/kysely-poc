import { Injectable } from '@nestjs/common';
import { Database, InjectDatabase, Transaction } from '@infra';
import { ConcertsRepo } from './concerts.repo';
import { AvailableSeat, ReservationConcert } from '@prisma/client';

@Injectable()
export class AvailableSeatsRepo {
  constructor(
    @InjectDatabase() private readonly database: Database,
    concertsRepo: ConcertsRepo,
  ) {
    concertsRepo.setTransactionalHook(async (trx, concertModel) => {
      await this.onConcertSaved(trx, concertModel);
    });
  }

  public async onConcertSaved(trx: Transaction, concert: ReservationConcert) {
    const seats = JSON.parse(concert.seats) as {
      [key: string]: { reserved: boolean };
    };

    const availableSeats: AvailableSeat[] = [];
    for (const seatNumber in seats) {
      if (seats[seatNumber].reserved) continue;

      availableSeats.push({
        id: `${concert.id}__${seatNumber}`,
        concertId: concert.id,
        seatNumber: parseInt(seatNumber),
      });
    }

    await trx.availableSeat.deleteMany({ where: { concertId: concert.id } });
    await trx.availableSeat.createMany({ data: availableSeats });
  }

  public async getByConcertId(concertId: string) {
    return this.database.availableSeat.findMany({ where: { concertId } });
  }
}
