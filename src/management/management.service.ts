import { ConcertsRepo } from './concerts.repo';
import { ManagementConcert } from '../@infra';
import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class ManagementService {
  constructor(
    private readonly concertsRepo: ConcertsRepo,
    private readonly reservationService: ReservationService,
  ) {}

  public async createConcert(title: string, date: string, description: string, seatingCapacity: number) {
    const concert: ManagementConcert = {
      id: nanoid(),
      title,
      date,
      description,
      seatingCapacity,
    };

    await this.concertsRepo.create(concert);

    await this.reservationService.onConcertCreated(concert);
    return { id: concert.id };
  }

  public async updateConcert(id: string, data: Omit<Partial<ManagementConcert>, 'id' | 'date'>) {
    const concert = await this.getConcertById(id);

    if (data.title) concert.title = data.title;
    if (data.description) concert.description = data.description;
    if (data.seatingCapacity) concert.seatingCapacity = data.seatingCapacity;

    await this.concertsRepo.update(concert);
    return { id: concert.id };
  }

  public async listConcerts() {
    return await this.concertsRepo.list();
  }

  public async getConcertById(id: string) {
    const concert = await this.concertsRepo.getById(id);
    if (!concert) throw new Error('Concert not found');
    return concert;
  }
}
