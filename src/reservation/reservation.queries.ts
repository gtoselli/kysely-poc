import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';
import { AvailableSeatsRepo } from './available-seats.repo';

@Injectable()
export class ReservationQueries {
  constructor(
    private readonly repo: ConcertsRepo,
    private readonly availableSeatsRepo: AvailableSeatsRepo,
  ) {
    this.repo.setTransactionalHook(async (trx, concertModel) => {
      await this.availableSeatsRepo.onConcertSaved(trx, concertModel);
    });
  }

  public async getAvailableSeats(id: string) {
    return await this.availableSeatsRepo.getByConcertId(id);
  }
}
