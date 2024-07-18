import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ReservationService } from '../reservation.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseInMemModule, DB, getDatabaseToken, ManagementConcert } from '../../@infra';
import { CommunicationService } from '../../communication/communication.service';
import { Kysely } from 'kysely';
import { ConcertCreatedEventHandler } from '../events/concert-created.event-handler';
import { ConcertCreatedEvent } from '../../management/events/concert-created.event';
import { EventBusModule } from '../../@infra/event-bus/event-bus.module';
import { EventBus } from '../../@infra/event-bus/event-bus.provider';

describe('Reservation', () => {
  let module: TestingModule;
  let service: ReservationService;
  let eventBus: EventBus;

  const CommunicationServiceMock = {
    onConcertSeatReserved: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule, EventBusModule],
      providers: [
        ReservationService,
        ConcertsRepo,
        AvailableSeatsRepo,
        { provide: CommunicationService, useValue: CommunicationServiceMock },
        ConcertCreatedEventHandler,
      ],
    }).compile();

    await module.init();

    service = module.get(ReservationService);
    eventBus = module.get(EventBus);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    await (module.get(getDatabaseToken()) as Kysely<DB>).deleteFrom('reservation__concerts').execute();
    await (module.get(getDatabaseToken()) as Kysely<DB>).deleteFrom('reservation__available_seats').execute();
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
      await eventBus.publish(new ConcertCreatedEvent({ concert }));

      const availableSeats = await service.getAvailableSeats(concert.id);
      expect(availableSeats).toHaveLength(10);
    });
  });

  describe('reserveSeat', () => {
    beforeEach(async () => {
      await eventBus.publish(new ConcertCreatedEvent({ concert }));
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
      });
    });

    it('should notify seat reserved to communication BC', async () => {
      await service.reserveSeat(concert.id, 1);

      expect(CommunicationServiceMock.onConcertSeatReserved).toHaveBeenCalledWith(concert.id, 1);
    });
  });
});
