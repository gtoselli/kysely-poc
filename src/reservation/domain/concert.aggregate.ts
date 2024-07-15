import { ConcertSeatsEntity } from './concert-seats.entity';

export class ConcertAggregate {
  constructor(
    public readonly id: string,
    public seatsEntity: ConcertSeatsEntity,
    public readonly version: number = 0,
  ) {}

  static factory(concertId: string, seatingCapacity: number) {
    const seatsEntity = ConcertSeatsEntity.createWithCapacity(seatingCapacity);
    return new ConcertAggregate(concertId, seatsEntity);
  }

  public getAvailableSeats() {
    return this.seatsEntity.getAvailableSeats().length;
  }

  public reserveSeat(seatNumber: number) {
    this.seatsEntity.reserveSeat(seatNumber);
  }
}
