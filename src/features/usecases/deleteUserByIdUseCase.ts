import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";

export class DeleteUserByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteUserByIdUseCaseCommand)
export class DeleteUserByIdUseCase implements ICommandHandler<DeleteUserByIdUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: DeleteUserByIdUseCaseCommand) {

        const user = await this.usersQueryRepository.getUserById(command.id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return await this.usersRepository.deleteById(command.id);
    }

}