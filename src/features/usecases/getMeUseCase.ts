import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";


export class GetMeUseCaseCommand {

    constructor(public userId: string) {
    }
}

@CommandHandler(GetMeUseCaseCommand)
export class GetMeUseCase implements ICommandHandler<GetMeUseCaseCommand> {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: GetMeUseCaseCommand) {

        const user = await this.usersQueryRepository.getUserById(command.userId)

        return ({
            "email": user?.email,
            "login": user?.login,
            "userId": user?.id
        })
    }

}