import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ManagementQueries {
  constructor(private readonly concertsRepo: ConcertsRepo) {}

  public async listConcerts() {
    return await this.concertsRepo.list();
  }

  public async getConcertById(id: string) {
    const concert = await this.concertsRepo.getById(id);
    if (!concert) throw new Error('Concert not found');
    return concert;
  }
}
