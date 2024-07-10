import { Injectable } from '@nestjs/common';
import { EmailChannelProvider } from './channels/email-channel.provider';

@Injectable()
export class CommunicationService {
  constructor(private readonly emailChannelProvider: EmailChannelProvider) {}

  public async sendReservationConfirmation(eventTitle: string) {
    await this.emailChannelProvider.send(
      'toselli.gabriele@gmail.com',
      '[CONCERTOSE] Reservation Confirmation',
      `You have successfully reserved a seat for the event ${eventTitle}`,
    );
  }

  async onConcertEventSeatReserved(id: string, seatNumber: number) {
    //TODO add real event name
    await this.sendReservationConfirmation(`Concert Event ${id} - Seat ${seatNumber}`);
  }
}
