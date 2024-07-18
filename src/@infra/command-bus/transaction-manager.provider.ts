import { Injectable, Logger } from '@nestjs/common';
import { DB, InjectDatabase } from '../database';
import { Kysely, Transaction } from 'kysely';

export interface ITransactionManager {
  wrapWithTransaction<T>(operation: (transaction: Transaction<DB>) => Promise<T>): Promise<T>;
}

@Injectable()
export class TransactionManager implements ITransactionManager {
  private readonly logger = new Logger(TransactionManager.name);

  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async wrapWithTransaction<T>(operation: (transaction: Transaction<DB>) => Promise<T>): Promise<T> {
    const now = new Date();
    this.logger.debug('Initiating transaction');
    const result = await this.database.transaction().execute(async (transaction) => {
      return await operation(transaction);
    });
    this.logger.debug(`Committed transaction \u{1F680}\u{1F680} in ${new Date().getTime() - now.getTime()}ms`);
    return result;
  }
}
