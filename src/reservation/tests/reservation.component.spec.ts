import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ConcertsService } from '../concerts.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseModule } from '../../infra/database/database.module';
import { DI_DATABASE_URI_TOKEN } from '../../infra/database/di-tokens';
import { Event } from '../../infra/database/types';

describe('Reservation', () => {
  let module: TestingModule;
  let service: ConcertsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ConcertsService, ConcertsRepo, AvailableSeatsRepo],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    await module.init();

    service = module.get(ConcertsService);
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
