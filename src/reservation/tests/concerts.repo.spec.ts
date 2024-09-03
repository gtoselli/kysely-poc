import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsRepo } from '../concerts.repo';
import { Database, DatabaseInMemModule, getDatabaseToken } from '@infra';
import { ConcertAggregate } from '../domain/concert.aggregate';

describe('Concerts repo', () => {
  let module: TestingModule;
  let repo: ConcertsRepo;
  let database: Database;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseInMemModule],
      providers: [ConcertsRepo],
    }).compile();

    await module.init();

    repo = module.get(ConcertsRepo);
    database = module.get(getDatabaseToken());
  });

  afterAll(async () => {
    await module.close();
  });

  afterEach(async () => {
    await database.reservationConcert.deleteMany({});
  });

  const id = 'foo-id';

  describe('Optimistic lock', () => {
    it('should throw an error if the version is outdated', async () => {
      const concert = ConcertAggregate.factory(id, 10);

      await database.$transaction((trx) => repo.saveAndSerialize(concert, trx));

      const instance1 = await repo.getByIdAndDeserialize(id);
      const instance2 = await repo.getByIdAndDeserialize(id);
      await database.$transaction((trx) => repo.saveAndSerialize(instance2!, trx));

      await expect(database.$transaction((trx) => repo.saveAndSerialize(instance1!, trx))).rejects.toThrow(
        'Cannot save aggregate foo-id due optimistic lock',
      );
    });

    it('should throw an error if the id is duplicated', async () => {
      const concert = ConcertAggregate.factory(id, 10);
      await database.$transaction((trx) => repo.saveAndSerialize(concert, trx));

      await expect(database.$transaction((trx) => repo.saveAndSerialize(concert, trx))).rejects.toThrow(
        'Cannot save aggregate foo-id due duplicated id',
      );
    });
  });
});
