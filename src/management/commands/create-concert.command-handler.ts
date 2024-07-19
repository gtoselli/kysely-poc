import { CreateConcertCommand } from './create-concert.command';
import { Context, EventBus, ICommandHandler, ManagementConcert } from '@infra';
import { nanoid } from 'nanoid';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ConcertCreatedEvent } from '../events/concert-created.event';
import { ManagementCommandBus } from '../management.command-bus';

@Injectable()
export class CreateConcertCommandHandler implements ICommandHandler<CreateConcertCommand> {
  constructor(
    private readonly concertsRepo: ConcertsRepo,
    private readonly eventBus: EventBus,
    managementCommandBus: ManagementCommandBus,
  ) {
    managementCommandBus.register(CreateConcertCommand, this);
  }

  async handle({ payload }: CreateConcertCommand, context: Context) {
    const concert: ManagementConcert = {
      id: nanoid(),
      title: payload.title,
      date: payload.date,
      description: payload.description,
      seatingCapacity: payload.seatingCapacity,
    };

    await this.concertsRepo.create(concert, context.transaction);

    await this.eventBus.publish(new ConcertCreatedEvent({ concert, context }));
    return { id: concert.id };
  }
}
