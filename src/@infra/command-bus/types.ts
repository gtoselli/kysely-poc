import { Context } from '@infra/command-bus/context-manager.provider';
import { generateId } from '@infra/ids';

export interface ICommand<TPayload, TResponse = void> {
  id: string;
  name: string;
  payload: TPayload;
  _returnType: TResponse;
}

export interface ICommandClass<C extends ICommand<unknown, unknown>> {
  new (payload: unknown): C;
}

export interface ICommandHandler<C extends ICommand<unknown, unknown>> {
  handle: (command: C, context?: Context) => Promise<C['_returnType']>;
}

export abstract class Command<TPayload, TResponse = void> implements ICommand<TPayload, TResponse> {
  readonly id: string;
  readonly name: string;
  readonly _returnType: TResponse;

  protected constructor(public readonly payload: TPayload) {
    this.name = this.constructor.name;
    this.id = generateId('cmd');
  }
}

export interface ICommandBus {
  register<C extends ICommand<unknown, unknown>>(command: ICommandClass<C>, handler: ICommandHandler<C>): void;

  send<C extends ICommand<unknown, unknown>>(command: C, existingTransaction?: unknown): Promise<C['_returnType']>;
}
