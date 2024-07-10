import { ConcertAggregate } from './concert.aggregate';

describe('concert aggregate', () => {
  describe('factory', () => {
    it('should instantiate a new instance of concert aggregate', () => {
      const concert = ConcertAggregate.factory(1);

      expect(concert).toBeInstanceOf(ConcertAggregate);
    });

    it('all seats should be available', () => {
      const concert = ConcertAggregate.factory(1);

      expect(concert.getAvailableSeats()).toBe(1);
    });
  });

  describe('reserveSeat', () => {
    let concert: ConcertAggregate;

    beforeEach(() => {
      concert = ConcertAggregate.factory(1);
    });

    it('should decrease available seats', () => {
      concert.reserveSeat(1);

      expect(concert.getAvailableSeats()).toBe(0);
    });

    it('should throw an error if given seat is already reserved', () => {
      concert.reserveSeat(1);

      expect(() => concert.reserveSeat(1)).toThrow('SEAT_ALREADY_RESERVED');
    });
  });
});
