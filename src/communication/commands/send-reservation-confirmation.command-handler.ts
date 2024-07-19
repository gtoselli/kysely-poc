import { ICommandHandler } from '@infra';
import { Injectable } from '@nestjs/common';
import { SendReservationConfirmationCommand } from './send-reservation-confirmation.command';
import { CommunicationCommandBus } from '../communication.command-bus';
import { EmailChannelProvider } from '../channels/email-channel.provider';

@Injectable()
export class SendReservationConfirmationCommandHandler implements ICommandHandler<SendReservationConfirmationCommand> {
  constructor(
    communicationCommandBus: CommunicationCommandBus,
    private readonly emailChannelProvider: EmailChannelProvider,
  ) {
    communicationCommandBus.register(SendReservationConfirmationCommand, this);
  }

  async handle({ payload }: SendReservationConfirmationCommand) {
    await this.emailChannelProvider.send(
      'toselli.gabriele@gmail.com',
      '[CONCERTOSE] Reservation Confirmation',
      `You have successfully reserved a seat for the concert ${payload.concertTitle}`,
    );
  }
}
