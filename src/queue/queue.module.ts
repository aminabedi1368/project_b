import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    EmailModule,
  ],
  providers: [EmailProcessor],
})
export class QueueModule {}
