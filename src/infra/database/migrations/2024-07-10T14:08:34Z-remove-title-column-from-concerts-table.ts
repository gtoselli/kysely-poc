import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('concerts').dropColumn('title').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('concerts')
    .addColumn('title', 'varchar', (col) => col.notNull())
    .execute();
}
