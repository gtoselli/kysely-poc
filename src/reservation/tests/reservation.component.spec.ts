import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ReservationService } from '../reservation.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseInMemModule, ManagementConcert } from '../../@infra';
import { CommunicationService } from '../../communication/communication.service';

describe('Reservation', () => {
  let module: TestingModule;
  let service: ReservationService;

  const CommunicationServiceMock = {
    onConcertSeatReserved: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule],
      providers: [
        ReservationService,
        ConcertsRepo,
        AvailableSeatsRepo,
        { provide: CommunicationService, useValue: CommunicationServiceMock },
      ],
    }).compile();

    await module.init();

    service = module.get(ReservationService);
  });

  afterAll(async () => {
    await module.close();
  });

  const concert: ManagementConcert = {
    id: 'foo-concert-id',
    title: 'Salmo',
    date: '2024-07-01',
    description: 'Hellraisers',
    seatingCapacity: 10,
  };

  describe('on ConcertCreated', () => {
    it('should create a concert with 10 seats', async () => {
      await service.onConcertCreated(concert);

      const availableSeats = await service.getAvailableSeats(concert.id);
      expect(availableSeats).toHaveLength(10);
    });
  });

  describe('reserveSeat', () => {
    beforeEach(async () => {
      await service.onConcertCreated(concert);
    });

    it('reserved seat should not be listed in available seats', async () => {
      await service.reserveSeat(concert.id, 1);

      const availableSeats = await service.getAvailableSeats(concert.id);
      expect(availableSeats).toHaveLength(9);
      expect(availableSeats.map((s) => s.seatNumber)).not.toContain(1);
      expect(availableSeats.map((s) => s.seatNumber)).toContain(2);
    });

    it('available seats should be listed', async () => {
      await service.reserveSeat(concert.id, 1);

      const availableSeats = await service.getAvailableSeats(concert.id);
      const availableSeat = availableSeats.find((s) => s.seatNumber === 2);

      expect(availableSeat).toMatchObject({
        seatNumber: 2,
        concertTitle: '',
      });
    });

    it('should notify seat reserved to communication BC', async () => {
      await service.reserveSeat(concert.id, 1);

      expect(CommunicationServiceMock.onConcertSeatReserved).toHaveBeenCalledWith(concert.id, 1);
    });
  });
});
