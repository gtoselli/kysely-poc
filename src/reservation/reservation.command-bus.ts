import { CommandBus, DB, InjectDatabase, ITransactionManager, TransactionManager } from '@infra';
import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class ReservationCommandBus extends CommandBus {
  constructor(@InjectDatabase() database: Kysely<DB>) {
    const transactionManager: ITransactionManager = new TransactionManager(database);
    super(transactionManager);
  }
}
