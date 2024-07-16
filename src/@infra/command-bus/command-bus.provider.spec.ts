import { CommandBus } from './command-bus.provider';
import { Command, ICommandHandler } from './types';

class FooCommand extends Command<{ foo: string }> {
  constructor(public payload: { foo: string }) {
    super(payload);
  }
}

class BarCommand extends Command<{ bar: string }> {
  constructor(public payload: { bar: string }) {
    super(payload);
  }
}

class UnknownCommand extends Command<{ bar: string }> {
  constructor(public payload: { bar: string }) {
    super(payload);
  }
}

class FooCommandHandler implements ICommandHandler<FooCommand> {
  async handle() {}
}

class BarCommandHandler implements ICommandHandler<BarCommand> {
  async handle() {}
}

describe('Local Command Bus', () => {
  let localCommandBus: CommandBus;

  beforeEach(() => {
    localCommandBus = new CommandBus(undefined);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fooCommand = new FooCommand({ foo: 'foo' });
  const barCommand = new BarCommand({ bar: 'bar' });
  const unknownCommand = new UnknownCommand({ bar: 'bar' });
  const fooCommandHandler = new FooCommandHandler();
  const barCommandHandler = new BarCommandHandler();

  let fooHandleSpy: jest.SpyInstance;
  let barHandleSpy: jest.SpyInstance;

  beforeEach(() => {
    localCommandBus.register(FooCommand, fooCommandHandler);
    localCommandBus.register(BarCommand, barCommandHandler);

    fooHandleSpy = jest.spyOn(fooCommandHandler, 'handle');
    barHandleSpy = jest.spyOn(barCommandHandler, 'handle');
  });

  it('sending foo command should call only foo handler', async () => {
    await localCommandBus.send(fooCommand);

    expect(fooHandleSpy).toHaveBeenCalledWith(fooCommand);
    expect(barHandleSpy).not.toHaveBeenCalled();
  });

  it('sending bar command should call only bar handler', async () => {
    await localCommandBus.send(barCommand);

    expect(barHandleSpy).toHaveBeenCalledWith(barCommand);
    expect(fooHandleSpy).not.toHaveBeenCalled();
  });

  it('sending other command should throw', async () => {
    await expect(() => localCommandBus.send(unknownCommand)).rejects.toThrow('No handler found for UnknownCommand');
  });

  it('registering another handler for foo command should throw', async () => {
    expect(() => localCommandBus.register(FooCommand, fooCommandHandler)).toThrow(
      'Command FooCommand is already registered',
    );
  });
});
