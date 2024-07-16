import { CommandBus } from '../../@infra/command-bus/command-bus.provider';
import { CreateConcertCommand } from './create-concert.command';
import { ManagementConcert } from '../../@infra';
import { nanoid } from 'nanoid';
import { ConcertsRepo } from '../concerts.repo';
import { ReservationService } from '../../reservation/reservation.service';
import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../@infra/command-bus/types';

@Injectable()
export class CreateConcertCommandHandler implements ICommandHandler<CreateConcertCommand> {
  constructor(
    private readonly concertsRepo: ConcertsRepo,
    private readonly reservationService: ReservationService,
    localCommandBus: CommandBus,
  ) {
    localCommandBus.register(CreateConcertCommand, this);
  }

  async handle({ payload }: CreateConcertCommand) {
    const concert: ManagementConcert = {
      id: nanoid(),
      title: payload.title,
      date: payload.date,
      description: payload.description,
      seatingCapacity: payload.seatingCapacity,
    };

    await this.concertsRepo.create(concert);

    await this.reservationService.onConcertCreated(concert);
    return { id: concert.id };
  }
}
