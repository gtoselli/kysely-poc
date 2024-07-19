import { Injectable } from '@nestjs/common';
import { EmailChannelProvider } from './channels/email-channel.provider';

@Injectable()
export class CommunicationService {
  constructor(private readonly emailChannelProvider: EmailChannelProvider) {}

  public async sendReservationConfirmation(concertTitle: string) {
    await this.emailChannelProvider.send(
      'toselli.gabriele@gmail.com',
      '[CONCERTOSE] Reservation Confirmation',
      `You have successfully reserved a seat for the concert ${concertTitle}`,
    );
  }
}
