import { EventBus, IEventHandler } from '@infra';
import { SeatReservedEvent } from '../../reservation/events/seat-reserved.event';
import { Injectable } from '@nestjs/common';
import { SendReservationConfirmationCommand } from '../commands/send-reservation-confirmation.command';
import { CommunicationCommandBus } from '../communication.command-bus';

@Injectable()
export class SeatReservedEventHandler implements IEventHandler<SeatReservedEvent> {
  constructor(
    eventBus: EventBus,
    private readonly communicationCommandBus: CommunicationCommandBus,
  ) {
    eventBus.subscribe(SeatReservedEvent, this);
  }

  async handle({ payload }: SeatReservedEvent) {
    const { concertId, seatNumber } = payload;
    await this.communicationCommandBus.send(
      new SendReservationConfirmationCommand({ concertTitle: `Concert ${concertId} - Seat ${seatNumber}\`` }),
    );
  }
}
