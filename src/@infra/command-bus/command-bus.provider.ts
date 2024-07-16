import { Logger } from '@nestjs/common';

export interface ICommand<TPayload, TResponse = void> {
  name: string;
  payload: TPayload;
  _returnType: TResponse;
}

export interface ICommandClass<C extends ICommand<unknown, unknown>> {
  new (payload: unknown): C;
}

export interface ICommandHandler<C extends ICommand<unknown, unknown>> {
  handle: (command: C) => Promise<C['_returnType']>;
}

export abstract class Command<TPayload, TResponse = void> implements ICommand<TPayload, TResponse> {
  readonly name: string;
  readonly _returnType: TResponse;

  protected constructor(public readonly payload: TPayload) {
    this.name = this.constructor.name;
  }
}

export interface ICommandBus {
  register<C extends ICommand<unknown, unknown>>(command: ICommandClass<C>, handler: ICommandHandler<C>): void;

  send<C extends ICommand<unknown, unknown>>(command: C): Promise<C['_returnType']>;
}

export class LocalCommandBus implements ICommandBus {
  private handlers: { [key: string]: ICommandHandler<ICommand<unknown, unknown>> } = {};

  constructor(private logger: Logger = new Logger(LocalCommandBus.name)) {}

  public register<C extends ICommand<unknown, unknown>>(command: ICommandClass<C>, handler: ICommandHandler<C>): void {
    if (this.handlers[command.name]) throw new Error(`Command ${command.name} is already registered`);
    this.handlers[command.name] = handler;
  }

  public async send<C extends ICommand<unknown, unknown>>(command: C): Promise<C['_returnType']> {
    const handler = this.handlers[command.name] as ICommandHandler<C>;
    if (!handler) throw new Error(`No handler found for ${command.name}`);
    return await handler.handle(command);
  }
}
