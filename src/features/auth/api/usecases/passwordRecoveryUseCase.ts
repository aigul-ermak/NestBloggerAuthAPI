import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../../../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {UserWithIdOutputModel} from "../../../users/api/models/output/user.output.model";
import {v4 as uuidv4} from "uuid";
import {EmailService} from "../../../email/email.service";
import {EmailDto} from "../../../email/models/input/email.input.dto";

export class PasswordRecoveryUseCaseCommand {
    constructor(
        public email: EmailDto
    ) {
    }
}

@CommandHandler(PasswordRecoveryUseCaseCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private emailService: EmailService,
    ) {
    }

    async execute(command: PasswordRecoveryUseCaseCommand) {

        const user: UserWithIdOutputModel | null = await this.usersQueryRepository.findOneByLoginOrEmail(command.email.email);


        if (user) {
            const passwordRecoveryCode: string = uuidv4();

            await this.usersRepository.updateUserPasswordRecoveryCode(user.id, passwordRecoveryCode);
            await this.emailService.sendRecoveryCodeMessage(user.accountData.email, passwordRecoveryCode);
            return true;
        }
        return false;
    }
}

