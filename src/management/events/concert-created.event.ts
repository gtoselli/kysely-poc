import { Context, Event } from '@infra';
import { ManagementConcert } from '@prisma/client';

type ConcertCreatedEventPayload = { concert: ManagementConcert; context?: Context };

export class ConcertCreatedEvent extends Event<ConcertCreatedEventPayload> {
  constructor(public readonly payload: ConcertCreatedEventPayload) {
    super(payload);
  }
}
