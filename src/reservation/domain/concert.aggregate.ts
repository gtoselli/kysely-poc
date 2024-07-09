import { nanoid } from 'nanoid';
import { ConcertSeatsEntity } from './concert-seats.entity';

export class ConcertAggregate {
  constructor(
    public readonly id: string,
    public title: string,
    public seatsEntity: ConcertSeatsEntity,
  ) {}

  static factory(title: string, seatingCapacity: number) {
    const seatsEntity = ConcertSeatsEntity.createWithCapacity(seatingCapacity);
    return new ConcertAggregate(nanoid(), title, seatsEntity);
  }

  public rename(newTitle: string) {
    this.title = newTitle;
  }

  public getAvailableSeats() {
    return this.seatsEntity.getAvailableSeats().length;
  }

  public reserveSeat(seatNumber: number) {
    this.seatsEntity.reserveSeat(seatNumber);
  }
}
