import { Command } from '@infra';

type CreateConcertCommandPayload = {
  title: string;
  date: string;
  description: string;
  seatingCapacity: number;
};

export class CreateConcertCommand extends Command<CreateConcertCommandPayload, { id: string }> {
  constructor(payload: CreateConcertCommandPayload) {
    super(payload);
  }
}
