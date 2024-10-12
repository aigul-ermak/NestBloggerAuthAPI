import {UsersRepository} from "../../../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserWithIdOutputModel} from "../../../users/api/models/output/user.output.model";
import {NewPasswordDto} from "../models/input/new-password.input.dto";
import bcrypt from "bcrypt";


export class CreateNewPasswordUseCaseCommand {

    constructor(public newPasswordDto: NewPasswordDto) {
    }
}

@CommandHandler(CreateNewPasswordUseCaseCommand)
export class CreateNewPasswordUseCase implements ICommandHandler<CreateNewPasswordUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: CreateNewPasswordUseCaseCommand) {

        let user: UserWithIdOutputModel | null = await this.usersQueryRepository.findUserByRecoveryCode(command.newPasswordDto.recoveryCode);
//TODO
        // if (!user) {
        //     return false
        // }
        //
        // if (new Date() > user.accountData.recoveryCodeExpirationDate) {
        //     throw new BadRequestException({
        //         errorsMessages: [
        //             {
        //                 message: 'Recovery code expired or invalid',
        //                 field: 'recoveryCode',
        //             }
        //         ]
        //     });
        // }

        if (user) {
            {
                const saltRounds: number = 10;
                const passwordHashed: string = await bcrypt.hash(command.newPasswordDto.recoveryCode, saltRounds);
                await this.usersRepository.updateUserPassword(user.id, passwordHashed);
                return true;
            }
        }

        return false;

    }

}