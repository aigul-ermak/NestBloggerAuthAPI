import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {BadRequestException} from "@nestjs/common";

export class ConfirmEmailUseCaseCommand {
    constructor(
        public code: string
    ) {
    }
}

@CommandHandler(ConfirmEmailUseCaseCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: ConfirmEmailUseCaseCommand) {

        const user = await this.usersQueryRepository.findUserByConfirmationCode(command.code);

        if (!user) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Confirmation code does not exist',
                        field: 'code',
                    }
                ]
            });
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Email already confirmed',
                        field: 'code',
                    }
                ]
            });
        }

        if (user.emailConfirmation.confirmationCode === command.code) {
            let result: boolean = await this.usersRepository.updateConfirmation(user.id)
            return result
        }
        return false;

    }
}

