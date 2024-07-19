import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { AvailableSeatsRepo } from './available-seats.repo';
import { DB } from '@infra';
import { Transaction } from 'kysely';

@Injectable()
export class ReservationService {
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

  public async create(concertId: string, seatingCapacity: number, transaction?: Transaction<DB>) {
    const concert = ConcertAggregate.factory(concertId, seatingCapacity);

    await this.repo.saveAndSerialize(concert, transaction);
    return { id: concert.id };
  }

  private async getById(id: string) {
    const concert = await this.repo.getByIdAndDeserialize(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }
}
