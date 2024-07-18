import { CommandBus } from '../@infra/command-bus/command-bus.provider';
import { Injectable } from '@nestjs/common';
import { DB, InjectDatabase } from '../@infra';
import { Kysely } from 'kysely';
import { ITransactionManager, TransactionManager } from '../@infra/command-bus/transaction-manager.provider';

@Injectable()
export class ManagementCommandBus extends CommandBus {
  constructor(@InjectDatabase() database: Kysely<DB>) {
    const transactionManager: ITransactionManager = new TransactionManager(database);
    super(transactionManager);
  }
}
