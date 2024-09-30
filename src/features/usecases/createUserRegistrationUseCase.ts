import {BadRequestException} from "@nestjs/common";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import bcrypt from "bcrypt";
import {UserDBModel} from "../users/api/models/input/user-db.input.model";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateUserDto} from "../users/api/models/input/create-user.input.dto";
import {v4 as uuidv4} from "uuid";
// import * as dateFns from "date-fns/index";
import {add} from 'date-fns';
import {EmailService} from "../email/email.service";


export class CreateUserRegistrationUseCaseCommand {

    constructor(public createUserDto: CreateUserDto) {
    }
}

@CommandHandler(CreateUserRegistrationUseCaseCommand)
export class CreateUserRegistrationUseCase implements ICommandHandler<CreateUserRegistrationUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private emailService: EmailService,
    ) {
    }

    async execute(command: CreateUserRegistrationUseCaseCommand) {

        const existsUserByLogin = await this.usersQueryRepository.findOneByLoginOrEmail(command.createUserDto.login);
        const existsUserByEmail = await this.usersQueryRepository.findOneByLoginOrEmail(command.createUserDto.email);

        if (existsUserByLogin) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'User with this login already exists',
                        field: 'login',
                    }
                ]
            });
        }

        if (existsUserByEmail) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'User with this email already exists',
                        field: 'email',
                    }
                ]
            });
        }

        const confirmationCode = uuidv4();
        const saltRounds = 10;
        const passwordHashed = await bcrypt.hash(command.createUserDto.password, saltRounds);

        const newUser: UserDBModel = {
            accountData: {
                login: command.createUserDto.login,
                email: command.createUserDto.email,
                passwordHash: passwordHashed,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), {hours: 1, minutes: 3}),
                isConfirmed: false
            }
        }

        const res = await this.usersRepository.createUser(newUser);

        if (!newUser) {
            throw new BadRequestException('User creation failed');
        }

        await this.emailService.sendEmailConfirmationMessage(newUser);

        return res;
    }

}