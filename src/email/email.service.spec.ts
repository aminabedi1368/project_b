import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './templates/welcome-email';
import * as Handlebars from 'handlebars';

// Mock nodemailer
jest.mock('nodemailer');
const sendMailMock = jest.fn();
nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: sendMailMock });

describe('EmailService', () => {
  let service: EmailService;

  beforeAll(() => {
    process.env.EMAIL_COMPANY = 'aminabedi1368@gmail.com';
    process.env.EMAIL_USER = '43b32ba19c40c3';
    process.env.EMAIL_PASS = 'fabbe11054a4dc';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should send a welcome email', async () => {
      const email = 'test@example.com';
      const name = 'Test User';

      const templateTS = Handlebars.compile(welcomeEmailTemplate);
      const expectedHtml = templateTS({ name });

      await service.sendWelcomeEmail(email, name);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.EMAIL_COMPANY,
        to: email,
        subject: 'Welcome to Our Company project B',
        html: expectedHtml,
      });
    });
  });
});
