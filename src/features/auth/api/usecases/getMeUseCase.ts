import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UnauthorizedException} from "@nestjs/common";
import {UserOutputModel} from "../../../users/api/models/output/user.output.model";


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

        const user: UserOutputModel | null = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return ({
            "email": user?.email,
            "login": user?.login,
            "userId": user?.id
        })
    }

}