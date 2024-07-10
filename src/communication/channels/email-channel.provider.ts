import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailChannelProvider {
  private readonly logger = new Logger(EmailChannelProvider.name);

  public async send(toEmail: string, subject: string, message: string) {
    this.logger.log(`Sending email to ${toEmail} with subject ${subject} and message ${message}`);
    await new Promise((r) => setTimeout(r, 2000));
    this.logger.log('Email sent ✅');
  }
}
