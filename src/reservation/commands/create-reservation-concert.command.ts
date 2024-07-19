import { Command } from '@infra';

type CreateReservationConcertCommandPayload = {
  concertId: string;
  seatingCapacity: number;
};
type CreateReservationConcertCommandResult = {
  id: string;
};

export class CreateReservationConcertCommand extends Command<
  CreateReservationConcertCommandPayload,
  CreateReservationConcertCommandResult
> {
  constructor(payload: CreateReservationConcertCommandPayload) {
    super(payload);
  }
}
