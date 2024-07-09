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

  it('add and get concert', async () => {
    const { id } = await service.addOne('Jake la Furia');

    const concert = await service.getById(id);

    expect(concert.title).toBe('Jake la Furia');

    await service.updateOne(id, 'Jake la Furia 2.0');

    const concertUpdated = await service.getById(id);
    expect(concertUpdated.title).toBe('Jake la Furia 2.0');
  });
});
