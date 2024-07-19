import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseInMemModule, DB, EventBus, getDatabaseToken } from '@infra';
import { ManagementQueries } from '../management.queries';
import { ConcertsRepo } from '../concerts.repo';
import { Kysely } from 'kysely';
import { CreateConcertCommand } from '../commands/create-concert.command';
import { CreateConcertCommandHandler } from '../commands/create-concert.command-handler';
import { ConcertCreatedEvent } from '../events/concert-created.event';
import { ManagementCommandBus } from '../management.command-bus';
import { UpdateConcertCommand } from '../commands/update-concert.command';
import { UpdateConcertCommandHandler } from '../commands/update-concert.command-handler';

describe('Management', () => {
  let module: TestingModule;
  let managementQueries: ManagementQueries;
  let managementCommandBus: ManagementCommandBus;

  const EventBusMock = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule],
      providers: [
        ManagementCommandBus,
        ManagementQueries,
        ConcertsRepo,
        { provide: EventBus, useValue: EventBusMock },
        CreateConcertCommandHandler,
        UpdateConcertCommandHandler,
      ],
    }).compile();

    await module.init();

    managementQueries = module.get(ManagementQueries);
    managementCommandBus = module.get(ManagementCommandBus);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const database = module.get(getDatabaseToken()) as Kysely<DB>;
    await database.deleteFrom('management__concerts').execute();
  });

  describe('createConcert', () => {
    it('should create a concert', async () => {
      const { id } = await managementCommandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );

      const concert = await managementQueries.getConcertById(id);
      expect(concert).toMatchObject({
        date: '2024-07-01',
        description: 'Hellraisers',
        seatingCapacity: 100,
        title: 'Salmo',
      });
    }, 20000);

    it('should publish ConcertCreated event', async () => {
      const { id } = await managementCommandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );

      const concert = await managementQueries.getConcertById(id);
      expect(EventBusMock.publish).toHaveBeenCalledWith(
        new ConcertCreatedEvent({ concert, context: expect.anything() }),
      );
    });
  });

  describe('listConcerts', () => {
    it('should list all concerts', async () => {
      await managementCommandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );
      await managementCommandBus.send(
        new CreateConcertCommand({
          title: 'Jovanotti',
          date: '2024-07-02',
          description: 'PalaJova',
          seatingCapacity: 100,
        }),
      );

      const concerts = await managementQueries.listConcerts();

      expect(concerts).toHaveLength(2);
      expect(concerts[1]).toMatchObject({
        date: '2024-07-02',
        description: 'PalaJova',
        id: expect.any(String),
        title: 'Jovanotti',
      });
    });
  });

  describe('update', () => {
    let concertId: string;

    beforeEach(async () => {
      const { id } = await managementCommandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );
      concertId = id;
    });

    it('should update the concert ', async () => {
      await managementCommandBus.send(new UpdateConcertCommand({ id: concertId, title: 'Maurizio Pisciottu' }));

      const concert = await managementQueries.getConcertById(concertId);
      expect(concert.title).toBe('Maurizio Pisciottu');
    });
  });
});
