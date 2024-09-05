import { Global, Module } from '@nestjs/common';
import { OutboxProvider } from '@infra/outbox/outbox.provider';

@Global()
@Module({
  providers: [OutboxProvider],
  exports: [OutboxProvider],
})
export class OutboxModule {}
