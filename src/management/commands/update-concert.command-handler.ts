import { DB } from '../../@infra';
import { ConcertsRepo } from '../concerts.repo';
import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../@infra/command-bus/types';
import { Transaction } from 'kysely';
import { ManagementCommandBus } from '../management.command-bus';
import { UpdateConcertCommand } from './update-concert.command';

@Injectable()
export class UpdateConcertCommandHandler implements ICommandHandler<UpdateConcertCommand> {
  constructor(
    private readonly concertsRepo: ConcertsRepo,
    managementCommandBus: ManagementCommandBus,
  ) {
    managementCommandBus.register(UpdateConcertCommand, this);
  }

  async handle({ payload }: UpdateConcertCommand, transaction: Transaction<DB>) {
    const concert = await this.concertsRepo.getById(payload.id, transaction);
    if (!concert) throw new Error('Concert not found');

    if (payload.title) concert.title = payload.title;
    if (payload.description) concert.description = payload.description;
    if (payload.seatingCapacity) concert.seatingCapacity = payload.seatingCapacity;

    await this.concertsRepo.update(concert, transaction);
  }
}
