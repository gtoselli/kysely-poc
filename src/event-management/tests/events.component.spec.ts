import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../infra/database/database.module';
import {
  DI_DATABASE_TOKEN,
  DI_DATABASE_URI_TOKEN,
} from '../../infra/database/di-tokens';
import { EventsService } from '../events.service';
import { EventsRepo } from '../events.repo';
import { Kysely } from 'kysely';
import { DB } from '../../infra/database/types';

describe('Event management', () => {
  let module: TestingModule;
  let service: EventsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [EventsService, EventsRepo],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    await module.init();

    service = module.get(EventsService);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const database = module.get(DI_DATABASE_TOKEN) as Kysely<DB>;
    await database.deleteFrom('events').execute();
  });

  describe('createConcertEvent', () => {
    it('should create a event with type concert', async () => {
      const { id } = await service.createConcertEvent(
        'Salmo',
        '2024-07-01',
        'Hellraisers',
      );

      const event = await service.getEventById(id);
      expect(event.type).toBe('concert');
    });
  });

  describe('listEvents', () => {
    it('should list all events', async () => {
      await service.createConcertEvent('Salmo', '2024-07-01', 'Hellraisers');
      await service.createConcertEvent('Jovanotti', '2024-07-02', 'PalaJova');

      const events = await service.listEvents();

      expect(events).toHaveLength(2);
      expect(events[1]).toMatchObject({
        date: '2024-07-02',
        description: 'PalaJova',
        id: expect.any(String),
        title: 'Jovanotti',
        type: 'concert',
      });
    });
  });

  describe('update', () => {
    let eventId: string;

    beforeEach(async () => {
      const { id } = await service.createConcertEvent(
        'Salmo',
        '2024-07-01',
        'Hellraisers',
      );
      eventId = id;
    });

    it('should update the event ', async () => {
      await service.updateEvent(eventId, { title: 'Maurizio Pisciottu' });

      const event = await service.getEventById(eventId);
      expect(event.title).toBe('Maurizio Pisciottu');
    });
  });
});
