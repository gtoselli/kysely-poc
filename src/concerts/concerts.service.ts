import { nanoid } from 'nanoid';
import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';

export type Concert = {
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
    const id = nanoid();
    const concert: Concert = { id, title };
    await this.repo.upsert(concert);

    return { id };
  }

  public async rename(id: string, newTitle: string) {
    const concert = await this.getById(id);
    concert.title = newTitle;

    await this.repo.upsert(concert);
  }

  public async getById(id: string) {
    const concert = await this.repo.getById(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }
}
