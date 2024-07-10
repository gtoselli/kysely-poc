import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('events')
    .addColumn('seatingCapacity', 'numeric')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('events').dropColumn('seatingCapacity').execute();
}
