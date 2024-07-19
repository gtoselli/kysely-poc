import { DB, EventBus, ICommandHandler } from '@infra';
import { ReserveSeatCommand } from './reserve-seat.command';
import { SeatReservedEvent } from '../events/seat-reserved.event';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ReservationCommandBus } from '../reservation.command-bus';
import { Transaction } from 'kysely';

@Injectable()
export class ReserveSeatCommandHandler implements ICommandHandler<ReserveSeatCommand> {
  constructor(
    private readonly repo: ConcertsRepo,
    private readonly eventBus: EventBus,
    reservationCommandBus: ReservationCommandBus,
  ) {
    reservationCommandBus.register(ReserveSeatCommand, this);
  }

  async handle({ payload }: ReserveSeatCommand, transaction: Transaction<DB>) {
    const concert = await this.repo.getByIdAndDeserialize(payload.concertId, transaction);
    if (!concert) throw new Error(`Concert ${payload.concertId} not found`);

    concert.reserveSeat(payload.seatNumber);
    await this.repo.saveAndSerialize(concert, transaction);

    await this.eventBus.publish(new SeatReservedEvent({ concertId: concert.id, seatNumber: payload.seatNumber }));
  }
}
