import { nanoid } from 'nanoid';
import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';

export type Concert = {
  id: string;
  title: string;
};

@Injectable()
export class ConcertsService {
  constructor(private readonly repo: ConcertsRepo) {}

  public async addOne(title: string) {
    const id = nanoid();
    const concert: Concert = { id, title };
    await this.repo.addOne(concert);

    return { id };
  }

  public async getById(id: string) {
    const concert = await this.repo.getById(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }
}
