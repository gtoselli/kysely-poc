import { Injectable, Logger } from '@nestjs/common';
import { Database, InjectDatabase, Transaction } from '../database';
import { generateId } from '@infra/ids';
import { inspect } from 'node:util';

export type Context = {
  transaction: Transaction;
  contextId: string;
  nestedContextsCount: number;
  startedAtISO: string;
};

export interface IContextManager {
  wrapWithContext<T>(operation: (context: Context) => Promise<T>, existingContext?: Context): Promise<T>;
}

@Injectable()
export class ContextManager implements IContextManager {
  private readonly logger = new Logger(ContextManager.name);

  constructor(@InjectDatabase() private readonly database: Database) {}

  public async wrapWithContext<T>(operation: (context: Context) => Promise<T>, existingContext?: Context): Promise<T> {
    return existingContext
      ? await this.mergeWithExistingContext(existingContext, operation)
      : await this.createFreshContext(operation);
  }

  private async mergeWithExistingContext<T>(existingContext: Context, operation: (context: Context) => Promise<T>) {
    const mergedContext = { ...existingContext, nestedContextsCount: existingContext.nestedContextsCount + 1 };
    this.logger.debug(
      `Using existing context with id ${mergedContext.contextId}. Nested count is ${mergedContext.nestedContextsCount}`,
    );
    return await operation(mergedContext);
  }

  private async createFreshContext<T>(operation: (context: Context) => Promise<T>) {
    const contextId = generateId('ctx');
    const now = new Date();
    this.logger.debug(`Create fresh context with id ${contextId} \u{1F4BE}`);

    const result = await this.database.$transaction(async (transaction) => {
      const context: Context = { transaction, contextId, nestedContextsCount: 0, startedAtISO: now.toISOString() };
      try {
        return await operation(context);
      } catch (error) {
        this.logger.error(`Error during operation in context with id ${contextId}: ${inspect(error)}`);
        throw error;
      }
    });
    this.logger.debug(`Context with id ${contextId} closed successfully in ${new Date().getTime() - now.getTime()}ms`);
    return result;
  }
}
