import { CommandBus, ContextManager, Database, IContextManager, InjectDatabase } from '@infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationCommandBus extends CommandBus {
  constructor(@InjectDatabase() database: Database) {
    const contextManager: IContextManager = new ContextManager(database);
    super(contextManager);
  }
}
