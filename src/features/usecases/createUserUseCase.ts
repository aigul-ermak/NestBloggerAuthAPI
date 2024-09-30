import {ConflictException, Injectable} from "@nestjs/common";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import bcrypt from "bcrypt";
import {UserDBModel} from "../users/api/models/input/user-db.input.model";
import {CreatePostForBlogInputDto} from "../posts/api/models/input/create-post.input.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreatePostUseCaseCommand} from "./createPostUseCase";
import {CreateUserDto} from "../users/api/models/input/create-user.input.dto";


export class CreateUserUseCaseCommand {

    constructor(public createUserDto: CreateUserDto) {
    }
}

@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: CreateUserUseCaseCommand) {

        const existingUser = await this.usersQueryRepository.findOneByEmail(command.createUserDto.email);

        if (existingUser) {
            throw new ConflictException(`User with this email already exists`);
        }

        const saltRounds: number = 10;
        const passwordHashed: string = await bcrypt.hash(command.createUserDto.password, saltRounds);


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
                confirmationCode: "",
                expirationDate: null,

                isConfirmed: false
            }
        }
        const userId = await this.usersRepository.createUser(newUser);

        return await this.usersQueryRepository.getUserById(userId);
    }


}