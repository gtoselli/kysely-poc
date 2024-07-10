import { InjectDatabase } from '../infra/database/di-tokens';
import { Kysely } from 'kysely';
import { DB, Event } from '../infra/database/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsRepo {
  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  public async create(event: Event) {
    await this.database.insertInto('events').values(event).execute();
  }

  public async update(event: Event) {
    await this.database.updateTable('events').set(event).where('id', '=', event.id).execute();
  }

  public async getById(id: string) {
    const event = await this.database.selectFrom('events').selectAll().where('id', '=', id).executeTakeFirst();

    return event ? event : null;
  }

  public async list() {
    return await this.database.selectFrom('events').selectAll().execute();
  }
}
