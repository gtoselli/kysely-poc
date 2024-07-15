import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('reservation__available_seats').dropColumn('concertTitle').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('reservation__available_seats')
    .addColumn('concertTitle', 'varchar', (col) => col.notNull())
    .execute();
}
