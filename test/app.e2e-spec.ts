import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { EventsService } from '../src/event-management/events.service';
import { DI_DATABASE_URI_TOKEN } from '../src/infra/database/di-tokens';
import { ConcertsService } from '../src/reservation/concerts.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let eventsService: EventsService;
  let concertsService: ConcertsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    eventsService = app.get(EventsService);
    concertsService = app.get(ConcertsService);
  });

  describe('Given no events', () => {
    describe('When create a concert event', () => {
      let eventId: string;

      beforeEach(async () => {
        const { id } = await eventsService.createConcertEvent(
          'Marracash',
          '20 novembre 2024',
          'Noi, Loro, Gli Altri Tour',
        );
        eventId = id;
      });

      it('should be listed in events list (in event-management BC)', async () => {
        const events = await eventsService.listEvents();

        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({
          title: 'Marracash',
        });
      });

      it('all places must be available (in reservation BC)', async () => {
        const availableSeats = await concertsService.getAvailableSeats(eventId);

        expect(availableSeats).toHaveLength(10);
      });
    });
  });
});
