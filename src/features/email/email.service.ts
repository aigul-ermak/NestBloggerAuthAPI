import {Injectable} from "@nestjs/common";
import {EmailAdapter} from "./email-adapter.service";

import {UserWithIdOutputModel} from "../users/api/models/output/user.output.model";
import {UserDBModel} from "../users/api/models/input/user-db.input.model";

@Injectable()
export class EmailService {
    constructor(private readonly emailAdapter: EmailAdapter) {
    }

    async sendEmailConfirmationMessage(user: UserDBModel): Promise<void> {
        const code: string = user.emailConfirmation.confirmationCode;
        const message: string = `
      <h1>Thanks for your registration</h1>
      <p>To finish registration, please follow the link below:
        <a href="https://somesite.com/confirm-email?code=${code}">Complete registration</a>
      </p>`;
        await this.emailAdapter.sendEmail(user.accountData.email, 'Email Confirmation', message);
    }

    async sendEmailMessage(user: UserWithIdOutputModel | null): Promise<void> {
        if (!user) {
            return;
        }

        const code: string = user.emailConfirmation.confirmationCode;
        const message: string = `
      <h1>Thanks for your registration</h1>
      <p>To finish registration, please follow the link below:
        <a href="https://somesite.com/confirm-email?code=${code}">Complete registration</a>
      </p>`;
        await this.emailAdapter.sendEmail(user.accountData.email, 'Email Confirmation', message);
    }

    async sendRecoveryCodeMessage(email: string, recoveryCode: string): Promise<void> {
        const message: string = `
      <h1>Password recovery</h1>
      <p>To finish password recovery, please follow the link below:
        <a href="https://somesite.com/password-recovery?recoveryCode=${encodeURIComponent(recoveryCode)}">Recover Password</a>
      </p>`;
        await this.emailAdapter.sendEmail(email, 'Password Recovery', message);
    }
}