import { DB, Event, ManagementConcert } from '@infra';
import { Transaction } from 'kysely';

type ConcertCreatedEventPayload = { concert: ManagementConcert; transaction?: Transaction<DB> };

export class ConcertCreatedEvent extends Event<ConcertCreatedEventPayload> {
  constructor(public readonly payload: ConcertCreatedEventPayload) {
    super(payload);
  }
}
