import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ICommandBus, ICommandClass, ICommandHandler } from './types';
import { ITransactionManager } from './transaction-manager.provider';

@Injectable()
export class CommandBus implements ICommandBus {
  private handlers: { [key: string]: ICommandHandler<ICommand<unknown, unknown>> } = {};

  private logger: Logger = new Logger(CommandBus.name);

  constructor(private readonly transactionManager?: ITransactionManager) {}

  public register<C extends ICommand<unknown, unknown>>(command: ICommandClass<C>, handler: ICommandHandler<C>): void {
    if (this.handlers[command.name]) throw new Error(`Command ${command.name} is already registered`);
    this.handlers[command.name] = handler;
    this.logger.debug(`Handler for command ${command.name} registered`);
  }

  public async send<C extends ICommand<unknown, unknown>>(command: C): Promise<C['_returnType']> {
    const handler = this.handlers[command.name] as ICommandHandler<C>;
    if (!handler) throw new Error(`No handler found for ${command.name}`);

    if (this.transactionManager) {
      return await this.transactionManager.wrapWithTransaction(async (transaction) => {
        return await handler.handle(command, transaction);
      });
    }

    return await handler.handle(command);
  }
}
