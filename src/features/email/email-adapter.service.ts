import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer';
import * as process from "process";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EmailAdapter {
    private transporter;

    constructor(private configService: ConfigService) {

        const user = this.configService.get<string>('emailSettings.EMAIL_USER');
        const pass = this.configService.get<string>('emailSettings.EMAIL_PASS');

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });
    }

    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: this.configService.get<string>('emailSettings.EMAIL_USER'),
                to,
                subject,
                html: message,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}