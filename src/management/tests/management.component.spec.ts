import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../@infra/database/database.module';
import { DI_DATABASE_TOKEN, DI_DATABASE_URI_TOKEN } from '../../@infra/database/di-tokens';
import { ManagementService } from '../management.service';
import { ConcertsRepo } from '../concerts.repo';
import { Kysely } from 'kysely';
import { DB } from '../../@infra/database/types';
import { ReservationService } from '../../reservation/reservation.service';

describe('Management', () => {
  let module: TestingModule;
  let service: ManagementService;

  const ReservationServiceMock = {
    onConcertCreated: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ManagementService, ConcertsRepo, { provide: ReservationService, useValue: ReservationServiceMock }],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .compile();

    await module.init();

    service = module.get(ManagementService);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    const database = module.get(DI_DATABASE_TOKEN) as Kysely<DB>;
    await database.deleteFrom('management_concerts').execute();
  });

  describe('createConcert', () => {
    it('should create a concert', async () => {
      const { id } = await service.createConcert('Salmo', '2024-07-01', 'Hellraisers', 100);

      const concert = await service.getConcertById(id);
      expect(concert).toMatchObject({
        date: '2024-07-01',
        description: 'Hellraisers',
        seatingCapacity: 100,
        title: 'Salmo',
      });
    });

    it('should notify concert creation to reservation BC', async () => {
      const { id } = await service.createConcert('Salmo', '2024-07-01', 'Hellraisers', 100);

      const concert = await service.getConcertById(id);
      expect(ReservationServiceMock.onConcertCreated).toBeCalledWith(concert);
    });
  });

  describe('listConcerts', () => {
    it('should list all concerts', async () => {
      await service.createConcert('Salmo', '2024-07-01', 'Hellraisers', 100);
      await service.createConcert('Jovanotti', '2024-07-02', 'PalaJova', 100);

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
      const { id } = await service.createConcert('Salmo', '2024-07-01', 'Hellraisers', 100);
      concertId = id;
    });

    it('should update the concert ', async () => {
      await service.updateConcert(concertId, { title: 'Maurizio Pisciottu' });

      const concert = await service.getConcertById(concertId);
      expect(concert.title).toBe('Maurizio Pisciottu');
    });
  });
});