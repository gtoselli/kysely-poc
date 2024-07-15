import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('management_concerts').renameTo('management__concerts').execute();
  await db.schema.alterTable('concerts').renameTo('reservation__concerts').execute();
  await db.schema.alterTable('available_seats').renameTo('reservation__available_seats').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('management__concerts').renameTo('management_concerts').execute();
  await db.schema.alterTable('reservation__concerts').renameTo('concerts').execute();
  await db.schema.alterTable('reservation__available_seats').renameTo('available_seats').execute();
}
