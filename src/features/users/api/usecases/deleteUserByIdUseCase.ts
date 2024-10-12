import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {UsersRepository} from "../../infrastructure/users.repository";
import {UsersQueryRepository} from "../../infrastructure/users.query-repository";

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