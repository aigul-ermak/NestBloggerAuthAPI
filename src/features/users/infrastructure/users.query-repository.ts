import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {FilterQuery, Model, SortOrder} from 'mongoose';
import {
    UserOutputModel,
    UserOutputModelMapper, UserWithIdOutputModel,
    UserWithIdOutputModelMapper
} from "../api/models/output/user.output.model";


@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({"accountData.email": email}).exec();
    }

    async getUserById(userId: string): Promise<UserOutputModel | null> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            return null;
        }

        return UserOutputModelMapper(user);
    }

    async findOneByLoginOrEmail(loginOrEmail: string): Promise<UserWithIdOutputModel | null> {
        const user = await this.userModel.findOne({
            $or:
                [
                    {'accountData.login': loginOrEmail},
                    {'accountData.email': loginOrEmail}
                ]
        })

        if (!user) {
            return null;
        }
        return UserWithIdOutputModelMapper(user);
    }


    async findUserByConfirmationCode(code: string) {
        const user: any = await this.userModel.findOne({"emailConfirmation.confirmationCode": code})
        if (!user) {
            return null;
        }

        return user;
    }

    async findAll(filter: any, sortBy: string, sortDirection: string, skip: number, limit: number) {

        const result = await this.userModel
            .find(filter)
            .sort({[`accountData.${sortBy}`]: (sortDirection === 'desc' ? -1 : 1) as SortOrder})
            .skip(skip)
            .limit(limit)
            .exec();

        return result;
    }

    async countDocuments(filter: FilterQuery<User>): Promise<number> {
        return this.userModel.countDocuments(filter).exec();
    }
}

