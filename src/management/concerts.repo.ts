import { DB, InjectDatabase, ManagementConcert } from '../@infra';
import { Kysely } from 'kysely';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcertsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async create(concert: ManagementConcert) {
    await this.database.insertInto('management__concerts').values(concert).execute();
  }

  public async update(concert: ManagementConcert) {
    await this.database.updateTable('management__concerts').set(concert).where('id', '=', concert.id).execute();
  }

  public async getById(id: string) {
    const concert = await this.database
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
