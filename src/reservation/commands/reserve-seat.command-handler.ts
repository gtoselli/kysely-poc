import { Context, EventBus, ICommandHandler, OutboxProvider } from '@infra';
import { ReserveSeatCommand } from './reserve-seat.command';
import { SeatReservedEvent } from '../events/seat-reserved.event';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ReservationCommandBus } from '../reservation.command-bus';

@Injectable()
export class ReserveSeatCommandHandler implements ICommandHandler<ReserveSeatCommand> {
  constructor(
    private readonly repo: ConcertsRepo,
    private readonly eventBus: EventBus,
    private readonly outboxProvider: OutboxProvider,
    reservationCommandBus: ReservationCommandBus,
  ) {
    reservationCommandBus.register(ReserveSeatCommand, this);
  }

  async handle({ payload }: ReserveSeatCommand, { transaction }: Context) {
    const concert = await this.repo.getByIdAndDeserialize(payload.concertId, transaction);
    if (!concert) throw new Error(`Concert ${payload.concertId} not found`);

    concert.reserveSeat(payload.seatNumber);
    await this.repo.saveAndSerialize(concert, transaction);

    const event = new SeatReservedEvent({ concertId: concert.id, seatNumber: payload.seatNumber });
    await this.eventBus.publish(event);
    await this.outboxProvider.scheduleEvents([event], transaction);
  }
}
