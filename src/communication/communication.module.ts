import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { EmailChannelProvider } from './channels/email-channel.provider';

@Module({
  providers: [CommunicationService, EmailChannelProvider],
})
export class CommunicationModule {}
