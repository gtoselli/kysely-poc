import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('events').renameTo('management_concerts').execute();
  await db.schema.alterTable('management_concerts').dropColumn('type').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('management_concerts').renameTo('events').execute();
  await db.schema
    .alterTable('events')
    .addColumn('type', 'varchar', (col) => col.notNull())
    .execute();
}
