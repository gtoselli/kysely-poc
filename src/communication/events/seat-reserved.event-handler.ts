import { EventBus, IEventHandler } from '@infra';
import { SeatReservedEvent } from '../../reservation/events/seat-reserved.event';
import { CommunicationService } from '../communication.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeatReservedEventHandler implements IEventHandler<SeatReservedEvent> {
  constructor(
    eventBus: EventBus,
    private readonly communicationService: CommunicationService,
  ) {
    eventBus.subscribe(SeatReservedEvent, this);
  }

  async handle({ payload }: SeatReservedEvent) {
    const { concertId, seatNumber } = payload;
    await this.communicationService.sendReservationConfirmation(`Concert ${concertId} - Seat ${seatNumber}`);
  }
}
