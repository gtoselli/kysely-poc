import { EventBus, IEventHandler } from '@infra';
import { ConcertCreatedEvent } from '../../management/events/concert-created.event';
import { Injectable } from '@nestjs/common';
import { ReservationService } from '../reservation.service';

@Injectable()
export class ConcertCreatedEventHandler implements IEventHandler<ConcertCreatedEvent> {
  constructor(
    eventBus: EventBus,
    private readonly reservationService: ReservationService,
  ) {
    eventBus.subscribe(ConcertCreatedEvent, this);
  }

  async handle({ payload }: ConcertCreatedEvent) {
    await this.reservationService.create(payload.concert.id, payload.concert.seatingCapacity, payload.transaction);
  }
}
