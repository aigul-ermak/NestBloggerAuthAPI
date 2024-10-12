import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {SessionQueryRepository} from "../../../session/infrastructure/session.query-repository";
import {NotFoundException} from "@nestjs/common";
import {SessionsOutputModelMapper} from "../../../session/api/models/output/session-db.output.model";


export class GetAllDevicesWithActiveSessionsUseCaseCommand {
    constructor(
        public userId: string,
    ) {
    }
}

@CommandHandler(GetAllDevicesWithActiveSessionsUseCaseCommand)
export class GetAllDevicesWithActiveSessionsUseCase implements ICommandHandler<GetAllDevicesWithActiveSessionsUseCaseCommand> {
    constructor(
        private sessionsQueryRepository: SessionQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: GetAllDevicesWithActiveSessionsUseCaseCommand) {
        const currentUser = await this.usersQueryRepository.getUserById(command.userId);

        if (!currentUser) {
            throw new NotFoundException(`User not found`);
        }

        const activeSessions = await this.sessionsQueryRepository.getUserDevicesActiveSessions(command.userId);

        if (activeSessions && activeSessions.length > 0) {
            return activeSessions.map(session => SessionsOutputModelMapper(session));
        } else {
            return [];
        }

    }
}