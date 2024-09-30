export class UserDBModel {
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
        passwordRecoveryCode: string;
        recoveryCodeExpirationDate: Date | null;
        createdAt: string;
    };

    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date | null;
        isConfirmed: boolean;
    }
}