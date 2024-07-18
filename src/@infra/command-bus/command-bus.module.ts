import { Global, Module } from '@nestjs/common';
import { CommandBus } from './command-bus.provider';
import { ITransactionManager, TransactionManager } from './transaction-manager.provider';

@Global()
@Module({
  providers: [
    {
      provide: CommandBus,
      useFactory: (transactionManager: ITransactionManager) => new CommandBus(transactionManager),
      inject: [TransactionManager],
    },
    TransactionManager,
  ],
  exports: [CommandBus],
})
export class CommandBusModule {}
