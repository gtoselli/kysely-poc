import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { AvailableSeatsRepo } from './available-seats.repo';

@Injectable()
export class ConcertsService {
  constructor(
    private readonly repo: ConcertsRepo,
    private readonly availableSeatsRepo: AvailableSeatsRepo,
  ) {
    this.repo.setTransactionalHook(async (trx, concertModel) => {
      await this.availableSeatsRepo.onConcertSaved(trx, concertModel);
    });
  }

  public async create(title: string, seatingCapacity: number) {
    const concert = ConcertAggregate.factory(title, seatingCapacity);

    await this.repo.saveAndSerialize(concert);
    return { id: concert.id };
  }

  public async rename(id: string, newTitle: string) {
    const concert = await this.getById(id);

    concert.rename(newTitle);
    await this.repo.saveAndSerialize(concert);
  }

  public async reserveSeat(id: string, seatNumber: number) {
    const concert = await this.getById(id);

    concert.reserveSeat(seatNumber);
    await this.repo.saveAndSerialize(concert);
  }

  public async getAvailableSeats(id: string) {
    return await this.availableSeatsRepo.getByConcertId(id);
  }

  public async getById(id: string) {
    const concert = await this.repo.getByIdAndDeserialize(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }
}
