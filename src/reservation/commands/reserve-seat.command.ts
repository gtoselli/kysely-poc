import { Command } from '@infra';

type ReserveSeatCommandPayload = {
  concertId: string;
  seatNumber: number;
};

export class ReserveSeatCommand extends Command<ReserveSeatCommandPayload> {
  constructor(payload: ReserveSeatCommandPayload) {
    super(payload);
  }
}
