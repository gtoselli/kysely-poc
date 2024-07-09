import { ConcertAggregate } from './concert.aggregate';

describe('concert aggregate', () => {
  describe('factory', () => {
    it('should instantiate a new instance of concert aggregate', () => {
      const concert = ConcertAggregate.factory('foo title', 1);

      expect(concert).toBeInstanceOf(ConcertAggregate);
    });

    it('should has the given title', () => {
      const concert = ConcertAggregate.factory('foo title', 1);

      expect(concert.title).toBe('foo title');
    });

    it('all seats should be available', () => {
      const concert = ConcertAggregate.factory('foo title', 1);

      expect(concert.getAvailableSeats()).toBe(1);
    });
  });

  describe('rename', () => {
    let concert: ConcertAggregate;

    beforeEach(() => {
      concert = ConcertAggregate.factory('foo title', 1);
    });

    it('should change the title of the concert', () => {
      concert.rename('bar title');

      expect(concert.title).toBe('bar title');
    });
  });

  describe('reserveSeat', () => {
    let concert: ConcertAggregate;

    beforeEach(() => {
      concert = ConcertAggregate.factory('foo title', 1);
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
