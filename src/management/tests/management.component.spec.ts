import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseInMemModule, DB, getDatabaseToken } from '../../@infra';
import { ManagementService } from '../management.service';
import { ConcertsRepo } from '../concerts.repo';
import { Kysely } from 'kysely';
import { CommandBusModule } from '../../@infra/command-bus/command-bus.module';
import { CommandBus } from '../../@infra/command-bus/command-bus.provider';
import { CreateConcertCommand } from '../commands/create-concert.command';
import { CreateConcertCommandHandler } from '../commands/create-concert.command-handler';
import { EventBus } from '../../@infra/event-bus/event-bus.provider';
import { ConcertCreatedEvent } from '../events/concert-created.event';

describe('Management', () => {
  let module: TestingModule;
  let service: ManagementService;
  let commandBus: CommandBus;

  const EventBusMock = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule, CommandBusModule],
      providers: [
        ManagementService,
        ConcertsRepo,
        { provide: EventBus, useValue: EventBusMock },
        CreateConcertCommandHandler,
      ],
    }).compile();

    await module.init();

    service = module.get(ManagementService);
    commandBus = module.get(CommandBus);
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
      const { id } = await commandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );

      const concert = await service.getConcertById(id);
      expect(concert).toMatchObject({
        date: '2024-07-01',
        description: 'Hellraisers',
        seatingCapacity: 100,
        title: 'Salmo',
      });
    }, 20000);

    it('should publish ConcertCreated event', async () => {
      const { id } = await commandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );

      const concert = await service.getConcertById(id);
      expect(EventBusMock.publish).toHaveBeenCalledWith(
        new ConcertCreatedEvent({ concert, transaction: expect.anything() }),
      );
    });
  });

  describe('listConcerts', () => {
    it('should list all concerts', async () => {
      await commandBus.send(
        new CreateConcertCommand({
          title: 'Salmo',
          date: '2024-07-01',
          description: 'Hellraisers',
          seatingCapacity: 100,
        }),
      );
      await commandBus.send(
        new CreateConcertCommand({
          title: 'Jovanotti',
          date: '2024-07-02',
          description: 'PalaJova',
          seatingCapacity: 100,
        }),
      );

      const concerts = await service.listConcerts();

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
      const { id } = await commandBus.send(
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
      await service.updateConcert(concertId, { title: 'Maurizio Pisciottu' });

      const concert = await service.getConcertById(concertId);
      expect(concert.title).toBe('Maurizio Pisciottu');
    });
  });
});
