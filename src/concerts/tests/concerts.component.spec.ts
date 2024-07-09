import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { DatabaseModule } from '../../infra/database.module';
import { ConcertsService } from '../concerts.service';

describe('Concerts component spec', () => {
  let module: TestingModule;
  let service: ConcertsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ConcertsService, ConcertsRepo],
    }).compile();

    service = module.get(ConcertsService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      const { id } = await service.create('Jake la Furia');

      const concert = await service.getById(id);
      expect(concert).toMatchObject({ title: 'Jake la Furia' });
    });
  });

  describe('rename', () => {
    let concertId: string;
    beforeEach(async () => {
      const { id } = await service.create('Jake la Furia');
      concertId = id;
    });

    it('should change the title of a concert', async () => {
      await service.rename(concertId, 'Jake la Furia & Gue Pequeno');

      const concert = await service.getById(concertId);
      expect(concert).toMatchObject({ title: 'Jake la Furia & Gue Pequeno' });
    });
  });
});
