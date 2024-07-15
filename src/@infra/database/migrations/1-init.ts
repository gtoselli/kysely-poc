import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('reservation__concerts')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('seats', 'varchar', (col) => col.notNull())
    .addColumn('_version', 'integer', (col) => col.notNull())
    .addUniqueConstraint('id_version', ['id', '_version'])
    .execute();

  await db.schema
    .createTable('reservation__available_seats')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('concertId', 'varchar', (col) => col.notNull())
    .addColumn('seatNumber', 'numeric', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('management__concerts')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('date', 'varchar', (col) => col.notNull())
    .addColumn('seatingCapacity', 'integer', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('reservation__concerts').execute();
  await db.schema.dropTable('reservation__available_seats').execute();
  await db.schema.dropTable('management__concerts').execute();
}
