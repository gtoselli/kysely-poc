import { EventsRepo } from './events.repo';
import { Event } from '../infra/database/types';
import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepo: EventsRepo,
    private readonly reservationService: ReservationService,
  ) {}

  public async createConcertEvent(
    title: string,
    date: string,
    description: string,
    seatingCapacity: number,
  ) {
    const event: Event = {
      id: nanoid(),
      title,
      date,
      description,
      type: 'concert',
      seatingCapacity,
    };

    await this.eventsRepo.create(event);

    await this.reservationService.onConcertEventCreated(event);
    return { id: event.id };
  }

  public async updateEvent(
    id: string,
    data: Omit<Partial<Event>, 'id' | 'date' | 'type'>,
  ) {
    const event = await this.getEventById(id);

    if (data.title) event.title = data.title;
    if (data.description) event.description = data.description;
    if (data.seatingCapacity) event.seatingCapacity = data.seatingCapacity;

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
