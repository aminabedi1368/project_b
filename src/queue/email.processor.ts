import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service';
import * as Sentry from '@sentry/node';
import { InternalServerErrorException } from '@nestjs/common';

@Processor('emailQueue')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Handles the processing of 'sendWelcomeEmail' jobs
   * @param job - The job containing the email and name data
   */
  @Process('sendWelcomeEmail')
  async handleSendWelcomeEmail(job: Job) {
    const { email, name } = job.data;
    try {
      await this.emailService.sendWelcomeEmail(email, name);
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }
}
