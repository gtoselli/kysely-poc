export class ConcertSeatsEntity {
  constructor(public seats: { [key: string]: { reserved: boolean } }) {}

  static createWithCapacity(seatingCapacity: number) {
    const seats = {};
    Array.from({ length: seatingCapacity }).forEach((_, index) => {
      seats[index + 1] = { reserved: false };
    });

    return new ConcertSeatsEntity(seats);
  }

  public getAvailableSeats() {
    return Object.entries(this.seats)
      .filter(([, seat]) => !seat.reserved)
      .map(([seatId]) => seatId);
  }

  public reserveSeat(seatNumber: number) {
    if (this.seats[seatNumber].reserved) {
      throw new Error('SEAT_ALREADY_RESERVED');
    }

    this.seats[seatNumber].reserved = true;
  }
}
