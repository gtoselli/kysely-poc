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
    const handler = this.getHandler(command);

    this.logger.debug(`Handling command ${JSON.stringify(command)}`);
    const result = await this.executeHandlerWithContext(handler, command, existingContext);
    this.logger.debug(`Command ${command.id} handled successfully`);

    return result;
  }

  private async executeHandlerWithContext<C extends ICommand<unknown, unknown>>(
    handler: ICommandHandler<C>,
    command: C,
    existingContext: Context | undefined,
  ) {
    return this.contextManager
      ? await this.contextManager.wrapWithContext(async (context) => {
          return await handler.handle(command, context);
        }, existingContext)
      : await handler.handle(command);
  }

  private getHandler<C extends ICommand<unknown, unknown>>(command: C) {
    const handler = this.handlers[command.name] as ICommandHandler<C>;
    if (!handler) throw new Error(`No handler found for ${command.name}`);
    return handler;
  }
}
