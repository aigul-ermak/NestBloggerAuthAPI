export type OutputUserItemType = {
    id: string,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordRecoveryCode: string,
        recoveryCodeExpirationDate: Date | null,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}