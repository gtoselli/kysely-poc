import { EventsRepo } from './events.repo';
import { Event } from '../infra/database/types';
import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { ConcertsService } from '../reservation/concerts.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepo: EventsRepo,
    private readonly concertsService: ConcertsService,
  ) {}

  public async createConcertEvent(
    title: string,
    date: string,
    description: string,
  ) {
    const event: Event = {
      id: nanoid(),
      title,
      date,
      description,
      type: 'concert',
    };

    await this.eventsRepo.create(event);

    await this.concertsService.onConcertEventCreated(event);
    return { id: event.id };
  }

  public async updateEvent(
    id: string,
    data: Omit<Partial<Event>, 'id' | 'date' | 'type'>,
  ) {
    const event = await this.getEventById(id);

    if (data.title) event.title = data.title;
    if (data.description) event.description = data.description;

    await this.eventsRepo.update(event);
    return { id: event.id };
  }

  public async listEvents() {
    return await this.eventsRepo.list();
  }

  public async getEventById(id: string) {
    const event = await this.eventsRepo.getById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }
}
