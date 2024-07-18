import { Transaction } from 'kysely';
import { DB } from '../database';

export interface ICommand<TPayload, TResponse = void> {
  name: string;
  payload: TPayload;
  _returnType: TResponse;
}

export interface ICommandClass<C extends ICommand<unknown, unknown>> {
  new (payload: unknown): C;
}

export interface ICommandHandler<C extends ICommand<unknown, unknown>> {
  handle: (command: C, transaction?: Transaction<DB>) => Promise<C['_returnType']>;
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
