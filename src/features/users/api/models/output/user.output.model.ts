import {UserDocument} from "../../../domain/users.entity";


export class UserOutputModel {
    id: string;
    login: string
    email: string
    createdAt: Date
}

export class UserWithIdOutputModel {
    id: string
    accountData: {
        passwordRecoveryCode: string;
        createdAt: Date;
        login: string;
        recoveryCodeExpirationDate: Date | null;
        email: string;
        passwordHash: string
    }
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

//mappers

export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
    const outputModel = new UserOutputModel();

    outputModel.id = user.id;
    outputModel.login = user.accountData.login;
    outputModel.email = user.accountData.email;
    outputModel.createdAt = user.accountData.createdAt;

    return outputModel;
}

export const UsersOutputModelMapper = (user: any) => {
    const outputModel = new UserOutputModel();

    outputModel.id = user.id;
    outputModel.login = user.accountData.login;
    outputModel.email = user.accountData.email;
    outputModel.createdAt = user.accountData.createdAt;

    return outputModel;
}

export const UserWithIdOutputModelMapper = (user: any): UserWithIdOutputModel => {

    const outputModel = new UserWithIdOutputModel();

    outputModel.id = user.id;

    outputModel.accountData = {
        login: user.accountData.login,
        email: user.accountData.email,
        passwordHash: user.accountData.passwordHash,
        passwordRecoveryCode: user.accountData.passwordRecoveryCode,
        recoveryCodeExpirationDate: user.accountData.recoveryCodeExpirationDate,
        createdAt: user.accountData.createdAt
    };

    outputModel.emailConfirmation = {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation.expirationDate,
        isConfirmed: user.emailConfirmation.isConfirmed
    };


    return outputModel;
}
