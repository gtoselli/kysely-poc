import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ReservationService } from '../reservation.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseModule } from '../../infra/database/database.module';
import { DI_DATABASE_URI_TOKEN } from '../../infra/database/di-tokens';
import { Event } from '../../infra/database/types';
import { CommunicationService } from '../../communication/communication.service';

describe('Reservation', () => {
  let module: TestingModule;
  let service: ReservationService;

  const CommunicationServiceMock = {
    onConcertEventSeatReserved: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ReservationService,
        ConcertsRepo,
        AvailableSeatsRepo,
        { provide: CommunicationService, useValue: CommunicationServiceMock },
      ],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    await module.init();

    service = module.get(ReservationService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      const { id } = await service.create('foo-event-id', 2);

      const concert = await service.getById(id);
      expect(concert).toMatchObject({ id });
    });
  });

  describe('reserveSeat', () => {
    let concertId: string;
    beforeEach(async () => {
      const { id } = await service.create('foo-event-id', 2);
      concertId = id;
    });

    it('reserved seat should not be listed in available seats', async () => {
      await service.reserveSeat(concertId, 1);

      const availableSeats = await service.getAvailableSeats(concertId);
      expect(availableSeats).toHaveLength(1);
      expect(availableSeats.map((s) => s.seatNumber)).not.toContain(1);
      expect(availableSeats.map((s) => s.seatNumber)).toContain(2);
    });

    it('available seats should be listed', async () => {
      await service.reserveSeat(concertId, 1);

      const availableSeats = await service.getAvailableSeats(concertId);
      const availableSeat = availableSeats.find((s) => s.seatNumber === 2);

      expect(availableSeat).toMatchObject({
        seatNumber: 2,
        concertTitle: '',
      });
    });

    it('should notify seat reserved to communication BC', async () => {
      await service.reserveSeat(concertId, 1);

      expect(CommunicationServiceMock.onConcertEventSeatReserved).toHaveBeenCalledWith(concertId, 1);
    });
  });

  describe('on ConcertEventCreated', () => {
    const event: Event = {
      id: 'foo-event-id',
      title: 'Salmo',
      date: '2024-07-01',
      description: 'Hellraisers',
      type: 'concert',
      seatingCapacity: 500,
    };

    it('should create a concert with 10 seats', async () => {
      await service.onConcertEventCreated(event);

      const concert = await service.getById(event.id);
      expect(concert.getAvailableSeats()).toBe(500);
    });
  });
});
