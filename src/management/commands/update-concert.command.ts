import { Command } from '@infra';
import { ManagementConcert } from '@prisma/client';

type UpdateConcertCommandPayload = Omit<Partial<ManagementConcert>, 'date' | 'id'> & { id: string };

export class UpdateConcertCommand extends Command<UpdateConcertCommandPayload> {
  constructor(payload: UpdateConcertCommandPayload) {
    super(payload);
  }
}
