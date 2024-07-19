import { Event } from '@infra';

type SeatReservedPayload = {
  concertId: string;
  seatNumber: number;
};

export class SeatReservedEvent extends Event<SeatReservedPayload> {
  constructor(payload: SeatReservedPayload) {
    super(payload);
  }
}
