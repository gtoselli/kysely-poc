import { Logger } from '@nestjs/common';
import { IEvent, IEventBus, IEventClass, IEventHandler } from './types';

export class EventBus implements IEventBus {
  private logger: Logger = new Logger(EventBus.name);

  private handlers: { [key: string]: IEventHandler<IEvent<unknown>>[] } = {};

  public subscribe<T extends IEvent<unknown>>(event: IEventClass<T>, handler: IEventHandler<T>): void {
    if (!this.handlers[event.name]) this.handlers[event.name] = [];
    this.handlers[event.name].push(handler);
  }

  public async publish<T extends IEvent<unknown>>(event: T): Promise<void> {
    const handlers = this.handlers[event.name] as IEventHandler<T>[];
    if (!handlers || !handlers.length) {
      this.logger.warn(`No handler found for ${event.name}`);
      return;
    }

    const results = await Promise.allSettled(handlers.map((handler) => handler.handle(event)));
    const failedHandlers = results.filter((r) => r.status === 'rejected');
    if (failedHandlers.length) {
      throw new Error(`Failed to handle ${event.name} event due to ${failedHandlers.map((r) => r.reason)}`);
    }
  }
}
