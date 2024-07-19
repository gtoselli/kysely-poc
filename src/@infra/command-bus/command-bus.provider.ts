import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ICommandBus, ICommandClass, ICommandHandler } from './types';
import { Context, IContextManager } from './context-manager.provider';

@Injectable()
export class CommandBus implements ICommandBus {
  private handlers: { [key: string]: ICommandHandler<ICommand<unknown, unknown>> } = {};

  private logger: Logger = new Logger(CommandBus.name);

  constructor(private readonly contextManager?: IContextManager) {}

  public register<C extends ICommand<unknown, unknown>>(command: ICommandClass<C>, handler: ICommandHandler<C>): void {
    if (this.handlers[command.name]) throw new Error(`Command ${command.name} is already registered`);
    this.handlers[command.name] = handler;
    this.logger.debug(`Handler for command ${command.name} registered`);
  }

  public async send<C extends ICommand<unknown, unknown>>(
    command: C,
    existingContext?: Context,
  ): Promise<C['_returnType']> {
    const handler = this.handlers[command.name] as ICommandHandler<C>;
    if (!handler) throw new Error(`No handler found for ${command.name}`);

    return this.contextManager
      ? await this.contextManager.wrapWithContext(async (context) => {
          return await handler.handle(command, context);
        }, existingContext)
      : await handler.handle(command);
  }
}
