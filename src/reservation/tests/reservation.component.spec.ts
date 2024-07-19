import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ReservationService } from '../reservation.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseInMemModule, DB, EventBus, getDatabaseToken, ManagementConcert } from '@infra';
import { Kysely } from 'kysely';
import { ConcertCreatedEventHandler } from '../events/concert-created.event-handler';
import { ConcertCreatedEvent } from '../../management/events/concert-created.event';
import { SeatReservedEvent } from '../events/seat-reserved.event';
import { ReservationCommandBus } from '../reservation.command-bus';
import { ReserveSeatCommandHandler } from '../commands/reserve-seat.command-handler';
import { ReserveSeatCommand } from '../commands/reserve-seat.command';
import { CreateReservationConcertCommandHandler } from '../commands/create-reservation-concert.command-handler';

describe('Reservation', () => {
  let module: TestingModule;
  let service: ReservationService;
  let reservationCommandBus: ReservationCommandBus;

  const EventBusMock = {
    publish: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule],
      providers: [
        ReservationService,
        ConcertsRepo,
        AvailableSeatsRepo,
        { provide: EventBus, useValue: EventBusMock },
        ConcertCreatedEventHandler,
        ReservationCommandBus,
        ReserveSeatCommandHandler,
        CreateReservationConcertCommandHandler,
      ],
    }).compile();

    await module.init();

    service = module.get(ReservationService);
    reservationCommandBus = module.get(ReservationCommandBus);
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
      await module
        .get<ConcertCreatedEventHandler>(ConcertCreatedEventHandler)
        .handle(new ConcertCreatedEvent({ concert }));

      const availableSeats = await service.getAvailableSeats(concert.id);
      expect(availableSeats).toHaveLength(10);
    });
  });

  describe('reserveSeat', () => {
    beforeEach(async () => {
      await module
        .get<ConcertCreatedEventHandler>(ConcertCreatedEventHandler)
        .handle(new ConcertCreatedEvent({ concert }));
    });

    it('reserved seat should not be listed in available seats', async () => {
      await reservationCommandBus.send(new ReserveSeatCommand({ concertId: concert.id, seatNumber: 1 }));

      const availableSeats = await service.getAvailableSeats(concert.id);
      expect(availableSeats).toHaveLength(9);
      expect(availableSeats.map((s) => s.seatNumber)).not.toContain(1);
      expect(availableSeats.map((s) => s.seatNumber)).toContain(2);
    });

    it('available seats should be listed', async () => {
      await reservationCommandBus.send(new ReserveSeatCommand({ concertId: concert.id, seatNumber: 1 }));

      const availableSeats = await service.getAvailableSeats(concert.id);
      const availableSeat = availableSeats.find((s) => s.seatNumber === 2);

      expect(availableSeat).toMatchObject({
        seatNumber: 2,
      });
    });

    it('should publish SeatReserved event', async () => {
      await reservationCommandBus.send(new ReserveSeatCommand({ concertId: concert.id, seatNumber: 1 }));

      expect(EventBusMock.publish).toHaveBeenCalledWith(
        new SeatReservedEvent({ concertId: concert.id, seatNumber: 1 }),
      );
    });
  });
});
