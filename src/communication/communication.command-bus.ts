import { CommandBus } from '@infra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationCommandBus extends CommandBus {
  constructor() {
    super();
  }
}
