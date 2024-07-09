import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { ConcertsService } from '../concerts.service';
import { AvailableSeatsRepo } from '../available-seats.repo';
import { DatabaseModule } from '../../infra/database/database.module';
import { DI_DATABASE_URI_TOKEN } from '../../infra/database/di-tokens';

describe('Concerts component spec', () => {
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
      const { id } = await service.create('Jake la Furia', 2);

      const concert = await service.getById(id);
      expect(concert).toMatchObject({ title: 'Jake la Furia' });
    });
  });

  describe('rename', () => {
    let concertId: string;
    beforeEach(async () => {
      const { id } = await service.create('Jake la Furia', 2);
      concertId = id;
    });

    it('should change the title of a concert', async () => {
      await service.rename(concertId, 'Jake la Furia & Gue Pequeno');

      const concert = await service.getById(concertId);
      expect(concert).toMatchObject({ title: 'Jake la Furia & Gue Pequeno' });
    });
  });

  describe('reserveSeat', () => {
    let concertId: string;
    beforeEach(async () => {
      const { id } = await service.create('Jake la Furia', 2);
      concertId = id;
    });

    it('should not be listed in available seats', async () => {
      await service.reserveSeat(concertId, 1);

      const availableSeats = await service.getAvailableSeats(concertId);
      expect(availableSeats).toHaveLength(1);
      expect(availableSeats.map((s) => s.seatNumber)).not.toContain(1);
      expect(availableSeats.map((s) => s.seatNumber)).toContain(2);
    });
  });
});
