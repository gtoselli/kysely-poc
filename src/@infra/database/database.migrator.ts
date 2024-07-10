import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FileMigrationProvider, Kysely, Migrator } from 'kysely';
import { DB } from './types';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectDatabase } from './di-tokens';

@Injectable()
export class DatabaseMigrator implements OnModuleInit {
  private readonly logger = new Logger(DatabaseMigrator.name);

  constructor(@InjectDatabase() private readonly database: Kysely<DB>) {}

  async onModuleInit() {
    const migrator = new Migrator({
      db: this.database,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, 'migrations'),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach(({ status, migrationName }) => {
      if (status === 'Success') {
        this.logger.log(`Migration "${migrationName}" was executed successfully`);
      } else if (status === 'Error') {
        this.logger.error(`failed to execute migration "${migrationName}"`);
      }
    });

    if (error) {
      this.logger.error(error);
      throw new Error('Failed to migrate database');
    }

    if (results?.length === 0) {
      this.logger.log('Database is up to date with the latest migration \u{1F680}');
    }
  }
}
