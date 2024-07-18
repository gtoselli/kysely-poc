import { CommandBus } from '../../@infra/command-bus/command-bus.provider';
import { CreateConcertCommand } from './create-concert.command';
import { DB, ManagementConcert } from '../../@infra';
import { nanoid } from 'nanoid';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../@infra/command-bus/types';
import { Transaction } from 'kysely';
import { EventBus } from '../../@infra/event-bus/event-bus.provider';
import { ConcertCreatedEvent } from '../events/concert-created.event';

@Injectable()
export class CreateConcertCommandHandler implements ICommandHandler<CreateConcertCommand> {
  constructor(
    private readonly concertsRepo: ConcertsRepo,
    private readonly eventBus: EventBus,
    localCommandBus: CommandBus,
  ) {
    localCommandBus.register(CreateConcertCommand, this);
  }

  async handle({ payload }: CreateConcertCommand, transaction: Transaction<DB>) {
    const concert: ManagementConcert = {
      id: nanoid(),
      title: payload.title,
      date: payload.date,
      description: payload.description,
      seatingCapacity: payload.seatingCapacity,
    };

    await this.concertsRepo.create(concert, transaction);

    await this.eventBus.publish(new ConcertCreatedEvent({ concert, transaction }));
    return { id: concert.id };
  }
}
