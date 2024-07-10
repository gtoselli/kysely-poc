import { nanoid } from 'nanoid';
import { ConcertSeatsEntity } from './concert-seats.entity';

export class ConcertAggregate {
  constructor(
    public readonly id: string,
    public seatsEntity: ConcertSeatsEntity,
  ) {}

  static factory(seatingCapacity: number) {
    const seatsEntity = ConcertSeatsEntity.createWithCapacity(seatingCapacity);
    return new ConcertAggregate(nanoid(), seatsEntity);
  }

  public getAvailableSeats() {
    return this.seatsEntity.getAvailableSeats().length;
  }

  public reserveSeat(seatNumber: number) {
    this.seatsEntity.reserveSeat(seatNumber);
  }
}
