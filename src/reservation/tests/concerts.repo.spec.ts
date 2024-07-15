import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { DatabaseInMemModule, DB, DI_DATABASE_TOKEN } from '../../@infra';
import { ConcertAggregate } from '../domain/concert.aggregate';
import { Kysely } from 'kysely';

describe('Concerts repo', () => {
  let module: TestingModule;
  let repo: ConcertsRepo;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule],
      providers: [ConcertsRepo],
    }).compile();

    await module.init();

    repo = module.get(ConcertsRepo);
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    await (module.get(DI_DATABASE_TOKEN) as Kysely<DB>).deleteFrom('reservation__concerts').execute();
  });

  const id = 'foo-id';

  describe('Optimistic lock', () => {
    it('should throw an error if the version is outdated', async () => {
      const concert = ConcertAggregate.factory(id, 10);
      await repo.saveAndSerialize(concert);

      const instance1 = await repo.getByIdAndDeserialize(id);
      const instance2 = await repo.getByIdAndDeserialize(id);
      await repo.saveAndSerialize(instance2!);

      await expect(repo.saveAndSerialize(instance1!)).rejects.toThrow(
        'Cannot save aggregate foo-id due optimistic lock',
      );
    });

    it('should throw an error if the id is duplicated', async () => {
      const concert = ConcertAggregate.factory(id, 10);
      await repo.saveAndSerialize(concert);

      await expect(repo.saveAndSerialize(concert!)).rejects.toThrow('Cannot save aggregate foo-id due duplicated id');
    });
  });
});
