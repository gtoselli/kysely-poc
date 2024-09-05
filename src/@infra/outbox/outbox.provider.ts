import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Database, IEvent, InjectDatabase, Transaction } from '@infra';
import { generateId } from '@infra/ids';
import { difference, intersection } from 'lodash';
import { inspect } from 'node:util';

@Injectable()
export class OutboxProvider implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxProvider.name);

  private stopping = false;

  constructor(@InjectDatabase() private readonly database: Database) {}

  public async onModuleInit() {
    this.logger.debug(`Starting outbox monitoring with interval ${500}ms`);
    void this.checkScheduledEvents([]);
  }

  public async onModuleDestroy() {
    this.stopping = true;
    await sleep(500);
  }

  public async scheduleEvents(events: IEvent<unknown>[], transaction: Transaction): Promise<void> {
    const outboxEvents = events.map((e) => ({
      id: generateId('outboxed_event'),
      event: e as any,
      scheduledAt: new Date(),
      status: 'scheduled',
      publishedAt: null,
    }));

    await transaction.outboxEvent.createMany({ data: outboxEvents });
    this.logger.debug(`Scheduled events ${outboxEvents.map((e) => e.id).join(', ')}`);
  }

  private async publishEvents(scheduledEventsIds: string[]): Promise<void> {
    await this.database.$transaction(async (transaction) => {
      const events = await transaction.outboxEvent.findMany({ where: { id: { in: scheduledEventsIds } } });

      this.logger.debug(`Send events ${JSON.stringify(events)}`);
      await transaction.outboxEvent.updateMany({
        where: { id: { in: scheduledEventsIds } },
        data: { publishedAt: new Date(), status: 'published' },
      });
    });
  }

  //FROM https://github.com/gpad/ms-practical-ws/blob/main/src/infra/outbox_pattern.ts
  private async checkScheduledEvents(warningIds: string[]) {
    try {
      if (this.stopping) return;
      await sleep(500);
      const currentIds = await this.retrieveScheduledEvents();
      const toPublish = intersection(currentIds, warningIds);
      if (toPublish.length) {
        await Promise.all(toPublish.map((eventId) => this.publishEventWithConcurrencyControl(eventId)));
      }
      const nextWarning = difference(currentIds, toPublish);
      void this.checkScheduledEvents(nextWarning);
    } catch (e) {
      this.logger.error(`Failed to check scheduled events. ${inspect(e)}`);
      void this.checkScheduledEvents([]);
    }
  }

  private async retrieveScheduledEvents() {
    const scheduledEvents = await this.database.outboxEvent.findMany({ where: { status: 'scheduled' } });
    return scheduledEvents.map((event) => event.id);
  }

  private async publishEventWithConcurrencyControl(eventId: string) {
    await this.publishEvents([eventId]);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
