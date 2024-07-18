import { Event } from './types';
import { EventBus } from './event-bus.provider';

class FooEvent extends Event<{ foo: string }> {
  constructor(public readonly payload: { foo: string }) {
    super(payload);
  }
}

class BarEvent extends Event<{ foo: string }> {
  constructor(public readonly payload: { foo: string }) {
    super(payload);
  }
}

describe('EventBus', () => {
  describe('Given an event bus', () => {
    let eventBus: EventBus;

    beforeEach(() => {
      eventBus = new EventBus();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('Given one subscribed handler to foo event', () => {
      const handler1Mock = jest.fn();

      class FooEventHandler {
        async handle(event: FooEvent) {
          await handler1Mock(event);
        }
      }

      beforeEach(() => {
        eventBus.subscribe(FooEvent, new FooEventHandler());
      });

      describe('When publish a foo event', () => {
        it('Should call handler with eventName and payload', async () => {
          const event = new FooEvent({ foo: 'bar' });
          await eventBus.publish(event);

          expect(handler1Mock).toHaveBeenCalledWith(event);
        });
      });

      describe('Given another subscribed handler to foo event', () => {
        const handler2Mock = jest.fn();

        class FooEventHandler2 {
          async handle(event: FooEvent) {
            await handler2Mock(event);
          }
        }

        beforeEach(() => {
          eventBus.subscribe(FooEvent, new FooEventHandler2());
        });

        describe('When publish event', () => {
          it('Should call two handlers with eventName and payload', async () => {
            const event = new FooEvent({ foo: 'bar' });
            await eventBus.publish(event);

            expect(handler1Mock).toHaveBeenCalledWith(event);
            expect(handler2Mock).toHaveBeenCalledWith(event);
          });
        });
      });

      describe('Given a handler subscribed for bar event', () => {
        const handler3Mock = jest.fn();

        class BarEventHandler {
          async handle(event: BarEvent) {
            await handler3Mock(event);
          }
        }

        beforeEach(() => {
          eventBus.subscribe(BarEvent, new BarEventHandler());
        });

        describe('When publish FooEvent', () => {
          it('Should call only FooEvent handler', async () => {
            const event = new FooEvent({ foo: 'bar' });
            await eventBus.publish(event);

            expect(handler1Mock).toHaveBeenCalledWith(event);
            expect(handler3Mock).not.toHaveBeenCalled();
          });
        });

        describe('When publish BarEvent', () => {
          it('Should call only BarEvent handler', async () => {
            const event = new BarEvent({ foo: 'bar' });
            await eventBus.publish(event);

            expect(handler1Mock).not.toHaveBeenCalled();
            expect(handler3Mock).toHaveBeenCalledWith(event);
          });
        });
      });
    });

    describe('Given two subscribed handlers (with one that fail) for foo event', () => {
      const handlerOkMock = jest.fn();
      const handlerKoMock = jest.fn();

      class FooEventHandlerOk {
        async handle(event: FooEvent) {
          await handlerOkMock(event);
        }
      }

      class FooEventHandlerKo {
        async handle(event: FooEvent) {
          await handlerKoMock(event);
        }
      }

      beforeEach(() => {
        handlerOkMock.mockResolvedValue('ok');
        handlerKoMock.mockRejectedValue(new Error('ko'));
        eventBus.subscribe(FooEvent, new FooEventHandlerOk());
        eventBus.subscribe(FooEvent, new FooEventHandlerKo());
      });

      describe('When publish event', () => {
        const event = new FooEvent({ foo: 'bar' });

        it('publish throw an exception', async () => {
          await expect(() => eventBus.publish(event)).rejects.toThrow();
        });

        it('both handler should be called', async () => {
          try {
            await eventBus.publish(event);
          } catch {}
          expect(handlerOkMock).toHaveBeenCalledWith(event);
          expect(handlerKoMock).toHaveBeenCalledWith(event);

          expect(handlerOkMock).toHaveBeenCalledTimes(1);
          expect(handlerKoMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
