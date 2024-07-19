import { Context, Event, ManagementConcert } from '@infra';

type ConcertCreatedEventPayload = { concert: ManagementConcert; context?: Context };

export class ConcertCreatedEvent extends Event<ConcertCreatedEventPayload> {
  constructor(public readonly payload: ConcertCreatedEventPayload) {
    super(payload);
  }
}
