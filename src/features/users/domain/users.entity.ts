import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {add} from "date-fns";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class AccountData {
    @Prop({required: true, unique: true})
    login: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop({default: ""})
    passwordRecoveryCode: string;

    @Prop({type: Date, default: null})
    recoveryCodeExpirationDate: Date | null;

    @Prop()
    createdAt: Date;
}


@Schema()
export class EmailConfirmation {
    @Prop({default: ""})
    confirmationCode: string;

    @Prop({type: Date, default: null})
    expirationDate: Date;

    @Prop({default: false})
    isConfirmed: boolean;
}

@Schema()
export class User {
    @Prop({type: AccountData, required: true})
    accountData: AccountData;

    @Prop({type: EmailConfirmation, required: true})
    emailConfirmation: EmailConfirmation;

    // static async createUser(
    //     login: string,
    //     email: string,
    //     password: string
    // ): Promise<{
    //     emailConfirmation: {
    //         confirmationCode: string;
    //         isConfirmed: boolean;
    //         expirationDate: Date;
    //     };
    //     accountData: {
    //         passwordRecoveryCode: string;
    //         createdAt: string;
    //         login: string;
    //         recoveryCodeExpirationDate: null;
    //         email: string;
    //         passwordHash: string;
    //     };
    // }> {
    //     const passwordHash = await User.hashPassword(password);

    // Correctly assigning an object to 'user'
    // const user = {
    //     accountData: {
    //         login,
    //         email,
    //         passwordHash,
    //         passwordRecoveryCode: "",
    //         recoveryCodeExpirationDate: null,
    //         createdAt: new Date().toISOString(),
    //     },
    //     emailConfirmation: {
    //         confirmationCode: "",
    //         expirationDate: add(new Date(), {
    //             hours: 1,
    //             minutes: 3,
    //         }),
    //         isConfirmed: false,
    //     },
    // };
    //
    // return user;
    // }

    // static async hashPassword(password: string): Promise<string> {
    //     const salt = await bcrypt.genSalt(10);
    //     return await bcrypt.hash(password, salt);
    // }

}

export const UsersEntity = SchemaFactory.createForClass(User);

// UsersEntity.pre<UserDocument>('save', async function (next) {
//     if (this.isModified('password') || this.isNew) {
//         this.password = await User.hashPassword(this.password);
//     }
//     next();
// });
