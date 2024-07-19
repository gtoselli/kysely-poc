import { EventBus, IEventHandler } from '@infra';
import { ConcertCreatedEvent } from '../../management/events/concert-created.event';
import { Injectable } from '@nestjs/common';
import { ReservationCommandBus } from '../reservation.command-bus';
import { CreateReservationConcertCommand } from '../commands/create-reservation-concert.command';

@Injectable()
export class ConcertCreatedEventHandler implements IEventHandler<ConcertCreatedEvent> {
  constructor(
    eventBus: EventBus,
    private readonly reservationCommandBus: ReservationCommandBus,
  ) {
    eventBus.subscribe(ConcertCreatedEvent, this);
  }

  async handle({ payload }: ConcertCreatedEvent) {
    await this.reservationCommandBus.send(
      new CreateReservationConcertCommand({
        concertId: payload.concert.id,
        seatingCapacity: payload.concert.seatingCapacity,
      }),
      payload.transaction,
    );
  }
}
