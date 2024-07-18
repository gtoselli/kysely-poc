import { DB, InjectDatabase, ManagementConcert } from '../@infra';
import { Kysely, Transaction } from 'kysely';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcertsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async create(concert: ManagementConcert, transaction?: Transaction<DB>) {
    await (transaction || this.database).insertInto('management__concerts').values(concert).execute();
  }

  public async update(concert: ManagementConcert, transaction?: Transaction<DB>) {
    await (transaction || this.database)
      .updateTable('management__concerts')
      .set(concert)
      .where('id', '=', concert.id)
      .execute();
  }

  public async getById(id: string, transaction?: Transaction<DB>) {
    const concert = await (transaction || this.database)
      .selectFrom('management__concerts')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return concert ? concert : null;
  }

  public async list() {
    return await this.database.selectFrom('management__concerts').selectAll().execute();
  }
}
