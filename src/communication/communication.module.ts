import { Module } from '@nestjs/common';
import { EmailChannelProvider } from './channels/email-channel.provider';
import { SeatReservedEventHandler } from './events/seat-reserved.event-handler';
import { CommunicationCommandBus } from './communication.command-bus';
import { SendReservationConfirmationCommandHandler } from './commands/send-reservation-confirmation.command-handler';

@Module({
  providers: [
    CommunicationCommandBus,
    EmailChannelProvider,
    SeatReservedEventHandler,
    SendReservationConfirmationCommandHandler,
  ],
})
export class CommunicationModule {}
