import { DB, ICommandHandler } from '@infra';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ReservationCommandBus } from '../reservation.command-bus';
import { Transaction } from 'kysely';
import { CreateReservationConcertCommand } from './create-reservation-concert.command';
import { ConcertAggregate } from '../domain/concert.aggregate';

@Injectable()
export class CreateReservationConcertCommandHandler implements ICommandHandler<CreateReservationConcertCommand> {
  constructor(
    private readonly repo: ConcertsRepo,
    reservationCommandBus: ReservationCommandBus,
  ) {
    reservationCommandBus.register(CreateReservationConcertCommand, this);
  }

  async handle({ payload }: CreateReservationConcertCommand, transaction: Transaction<DB>) {
    const concert = ConcertAggregate.factory(payload.concertId, payload.seatingCapacity);

    await this.repo.saveAndSerialize(concert, transaction);
    return { id: concert.id };
  }
}
