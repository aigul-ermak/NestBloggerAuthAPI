import {BadRequestException} from "@nestjs/common";
import {UsersRepository} from "../../../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {v4 as uuidv4} from "uuid";
import {EmailService} from "../../../email/email.service";
import {UserWithIdOutputModel} from "../../../users/api/models/output/user.output.model";
import {EmailDto} from "../../../email/models/input/email.input.dto";


export class SendNewCodeToEmailUseCaseCommand {

    constructor(public resendEmailDto: EmailDto) {
    }
}

@CommandHandler(SendNewCodeToEmailUseCaseCommand)
export class SendNewCodeToEmailUseCase implements ICommandHandler<SendNewCodeToEmailUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private emailService: EmailService,
    ) {
    }

    async execute(command: SendNewCodeToEmailUseCaseCommand) {

        const newCode: string = uuidv4();

        let user: UserWithIdOutputModel | null = await this.usersQueryRepository.findOneByLoginOrEmail(command.resendEmailDto.email);

        if (!user) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Email does not exist',
                        field: 'email',
                    }
                ]
            });
        }

        if (user!.emailConfirmation.isConfirmed) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Email already confirmed',
                        field: 'email',
                    }
                ]
            });
        }

        await this.usersRepository.updateUserCode(user!.id, newCode)

        let userWithNewCode: UserWithIdOutputModel | null = await await this.usersQueryRepository.findOneByLoginOrEmail(user!.accountData.email);

        await this.emailService.sendEmailMessage(userWithNewCode);

        return true;

    }

}