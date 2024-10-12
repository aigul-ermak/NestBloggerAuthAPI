import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {Model} from 'mongoose';
import {UserDBModel} from "../api/models/input/user-db.input.model";


@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async createUser(user: UserDBModel) {
        const result = await this.userModel.create(user);
        return result._id.toString();
    }

    async findOneByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({"accountData.login": login}).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async updateConfirmation(id: string): Promise<boolean> {
        let result = await this.userModel
            .updateOne(
                {_id: id},
                {
                    $set: {'emailConfirmation.isConfirmed': true}
                }
            )

        return result.modifiedCount > 0;
    }

    async updateUserCode(id: string, code: string): Promise<boolean> {
        let result = await this.userModel
            .updateOne({_id: id}, {$set: {'emailConfirmation.confirmationCode': code}})

        return result.modifiedCount > 0;
    }

    async updateUserPasswordRecoveryCode(userId: string, passwordRecoveryCode: string): Promise<void> {
        await this.userModel
            .updateOne({_id: userId},
                {
                    $set: {
                        'accountData.passwordRecoveryCode': passwordRecoveryCode,
                        'accountData.recoveryCodeExpirationDate': new Date(Date.now() + (1 * 60 + 3) * 60 * 1000)
                    }
                }
            )
    }

    //TODO
    async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
        await this.userModel
            .updateOne({_id: userId},
                {
                    $set: {
                        'accountData.passwordHash': passwordHash,
                        'accountData.passwordRecoveryCode': "",
                        'accountData.recoveryCodeExpirationDate': ""
                    }
                }
            )
    }
}
