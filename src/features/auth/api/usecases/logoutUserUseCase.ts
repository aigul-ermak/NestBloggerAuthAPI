import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../../../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {JwtService} from "@nestjs/jwt";
import {SessionRepository} from "../../../session/infrastructure/session.repository";
import {SessionQueryRepository} from "../../../session/infrastructure/session.query-repository";
import {UnauthorizedException} from "@nestjs/common";


export class LogoutUserUseCaseCommand {
    constructor(
        public userId: string,
        public deviceId: string
    ) {
    }
}

@CommandHandler(LogoutUserUseCaseCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private jwtService: JwtService,
        private sessionRepository: SessionRepository,
        private sessionQueryRepository: SessionQueryRepository,
    ) {
    }

    async execute(command: LogoutUserUseCaseCommand) {

        const session = await this.sessionQueryRepository.getUserSession(command.userId, command.deviceId);

        if (!session) {
            throw new UnauthorizedException('Session not found');
        }

        await this.sessionRepository.deleteSession(command.userId, command.deviceId)

        return true;
    }


}
