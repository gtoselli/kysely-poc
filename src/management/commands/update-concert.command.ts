import { Command } from '../../@infra/command-bus/types';
import { ManagementConcert } from '../../@infra';

type UpdateConcertCommandPayload = Omit<Partial<ManagementConcert>, 'date' | 'id'> & { id: string };

export class UpdateConcertCommand extends Command<UpdateConcertCommandPayload> {
  constructor(payload: UpdateConcertCommandPayload) {
    super(payload);
  }
}
