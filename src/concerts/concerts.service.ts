import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';

export type ConcertModel = {
  id: string;
  title: string;
};

@Injectable()
export class ConcertsService {
  constructor(private readonly repo: ConcertsRepo) {
    this.repo.setTransactionalHook(async (trx) => {
      console.log('doing something transactional for 100ms');
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('done doing something transactional for 1ms');
    });
  }

  public async create(title: string) {
    const concert = ConcertAggregate.factory(title);

    await this.repo.saveAndSerialize(concert);
    return { id: concert.id };
  }

  public async rename(id: string, newTitle: string) {
    const concert = await this.getById(id);

    concert.rename(newTitle);
    await this.repo.saveAndSerialize(concert);
  }

  public async getById(id: string) {
    const concert = await this.repo.getByIdAndDeserialize(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }
}
