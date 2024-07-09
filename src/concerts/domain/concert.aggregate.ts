import { nanoid } from 'nanoid';

export class SeatsEntity {
  constructor(public seats: { [key: string]: { occupied: boolean } }) {}

  static createWithCapacity(seatingCapacity: number) {
    const seats = {};
    Array.from({ length: seatingCapacity }).forEach((_, index) => {
      seats[index + 1] = { occupied: false };
    });

    return new SeatsEntity(seats);
  }

  public getAvailableSeats() {
    return Object.entries(this.seats)
      .filter(([, seat]) => !seat.occupied)
      .map(([seatId]) => seatId);
  }

  public reserveSeat(seatNumber: number) {
    if (this.seats[seatNumber].occupied) {
      throw new Error('SEAT_ALREADY_RESERVED');
    }

    this.seats[seatNumber].occupied = true;
  }
}

export class ConcertAggregate {
  constructor(
    public readonly id: string,
    public title: string,
    public seatsEntity: SeatsEntity,
  ) {}

  static factory(title: string, seatingCapacity: number) {
    const seatsEntity = SeatsEntity.createWithCapacity(seatingCapacity);
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
