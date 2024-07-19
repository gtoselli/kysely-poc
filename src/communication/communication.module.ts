import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { EmailChannelProvider } from './channels/email-channel.provider';
import { SeatReservedEventHandler } from './events/seat-reserved.event-handler';

@Module({
  providers: [CommunicationService, EmailChannelProvider, SeatReservedEventHandler],
  exports: [CommunicationService],
})
export class CommunicationModule {}
