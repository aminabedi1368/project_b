import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import * as fs from 'fs';
// import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as Sentry from '@sentry/node'; // Import Sentry for error logging
import { welcomeEmailTemplate } from './templates/welcome-email';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Initialize the nodemailer transporter with Mailtrap settings
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER, // Retrieve the username from environment variables
        pass: process.env.EMAIL_PASS, // Retrieve the password from environment variables
      },
    });
  }

  /**
   * Sends a welcome email to a new user
   * @param email - The email address of the recipient
   * @param name - The name of the recipient
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // const templatePath = path.resolve(
    //   __dirname,
    //   './templates/welcome-email.hbs',
    // );
    // const source = fs.readFileSync(templatePath, 'utf8');
    // const template = Handlebars.compile(source);
    try {
      // Compile the Handlebars template with the provided name
      const template = Handlebars.compile(welcomeEmailTemplate);
      const html = template({ name });

      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_COMPANY, // Retrieve the sender's email from environment variables
        to: email,
        subject: 'Welcome to Our Company project B',
        html,
      };
      // Send the email using the transporter
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Capture and log the error using Sentry
      Sentry.captureException(error);
      // Throw an internal server error to the client
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }
}
