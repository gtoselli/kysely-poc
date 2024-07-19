import { Command } from '@infra';

type SendReservationConfirmationCommandPayload = {
  concertTitle: string;
};

export class SendReservationConfirmationCommand extends Command<SendReservationConfirmationCommandPayload> {
  constructor(payload: SendReservationConfirmationCommandPayload) {
    super(payload);
  }
}
