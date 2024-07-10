import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DI_DATABASE_URI_TOKEN } from '../src/infra/database/di-tokens';
import { ReservationService } from '../src/reservation/reservation.service';
import { ManagementService } from '../src/management/management.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let managementService: ManagementService;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    managementService = app.get(ManagementService);
    reservationService = app.get(ReservationService);
  });

  describe('Given no events', () => {
    describe('When create a concert event', () => {
      let eventId: string;

      beforeEach(async () => {
        const { id } = await managementService.createConcertEvent(
          'Marracash',
          '20 novembre 2024',
          'Noi, Loro, Gli Altri Tour',
          100,
        );
        eventId = id;
      });

      it('should be listed in events list (in event-management BC)', async () => {
        const events = await managementService.listEvents();

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({
          title: 'Marracash',
        });
      });

      it('all places must be available (in reservation BC)', async () => {
        const availableSeats =
          await reservationService.getAvailableSeats(eventId);

        expect(availableSeats).toHaveLength(100);
      });
    });
  });

  describe('Given a scheduled concert event', () => {
    let eventId: string;

    beforeEach(async () => {
      const { id } = await managementService.createConcertEvent(
        'Marracash',
        '20 novembre 2024',
        'Noi, Loro, Gli Altri Tour',
        100,
      );
      eventId = id;
    });

    describe('When reserve seat', () => {
      beforeEach(async () => {
        await reservationService.reserveSeat(eventId, 1);
      });

      it('reserved seat must not be shown as available', async () => {
        const availableSeats =
          await reservationService.getAvailableSeats(eventId);

        expect(availableSeats).toHaveLength(99);
      });
    });
  });
});
