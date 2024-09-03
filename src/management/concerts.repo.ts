import { Database, InjectDatabase, Transaction } from '@infra';
import { Injectable } from '@nestjs/common';
import { ManagementConcert } from '@prisma/client';

@Injectable()
export class ConcertsRepo {
  constructor(@InjectDatabase() private readonly database: Database) {}

  public async create(concert: ManagementConcert, transaction: Transaction) {
    await transaction.managementConcert.create({ data: concert });
  }

  public async update(concert: ManagementConcert, transaction: Transaction) {
    await transaction.managementConcert.update({ where: { id: concert.id }, data: concert });
  }

  public async getById(id: string, transaction?: Transaction) {
    const concert = await (transaction || this.database).managementConcert.findUnique({ where: { id } });

    return concert ? concert : null;
  }

  public async list(transaction?: Transaction) {
    return (transaction || this.database).managementConcert.findMany({});
  }
}
