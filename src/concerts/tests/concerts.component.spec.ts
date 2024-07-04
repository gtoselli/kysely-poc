import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { DatabaseModule } from '../../infra/database.module';

describe('Concerts component spec', () => {
  let module: TestingModule;
  let concertsRepo: ConcertsRepo;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ConcertsRepo],
    }).compile();

    concertsRepo = module.get(ConcertsRepo);
    await concertsRepo.onModuleInit();
  });

  afterAll(async () => {
    await module.close();
  });

  it('add and get concert', async () => {
    const { id } = await concertsRepo.addOne('Jake la Furia');

    const concert = await concertsRepo.getById(id);

    expect(concert.title).toBe('Jake la Furia');
  });
});
