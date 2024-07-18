import { DB, ManagementConcert } from '../../@infra';
import { Event } from '../../@infra/event-bus/types';
import { Transaction } from 'kysely';

type ConcertCreatedEventPayload = { concert: ManagementConcert; transaction?: Transaction<DB> };

export class ConcertCreatedEvent extends Event<ConcertCreatedEventPayload> {
  constructor(public readonly payload: ConcertCreatedEventPayload) {
    super(payload);
  }
}
