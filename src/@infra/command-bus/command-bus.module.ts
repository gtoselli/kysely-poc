import { Global, Module } from '@nestjs/common';
import { CommandBus } from './command-bus.provider';

@Global()
@Module({
  providers: [
    {
      provide: CommandBus,
      useFactory: () => new CommandBus(),
    },
  ],
  exports: [CommandBus],
})
export class CommandBusModule {}
