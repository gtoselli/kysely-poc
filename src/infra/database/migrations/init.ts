import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('concerts')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('seats', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('available_seats')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('concertId', 'varchar', (col) => col.notNull())
    .addColumn('seatNumber', 'numeric', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('concerts').execute();
  await db.schema.dropTable('available_seats').execute();
}
