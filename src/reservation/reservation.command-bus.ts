import { CommandBus, ContextManager, DB, IContextManager, InjectDatabase } from '@infra';
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class ReservationCommandBus extends CommandBus {
  constructor(@InjectDatabase() database: Kysely<DB>) {
    const contextManager: IContextManager = new ContextManager(database);
    super(contextManager);
  }
}
