import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {NotFoundException} from "@nestjs/common";
import {SessionRepository} from "../session/infrastructure/session.repository";
import {SessionQueryRepository} from "../session/infrastructure/session.query-repository";

export class DeleteOtherSessionsUseCaseCommand {
    constructor(
        public userId: string,
        public deviceId: string) {
    }
}

@CommandHandler(DeleteOtherSessionsUseCaseCommand)
export class DeleteOtherSessionUseCase implements ICommandHandler<DeleteOtherSessionsUseCaseCommand> {
    constructor(
        private sessionRepository: SessionRepository,
        private sessionQueryRepository: SessionQueryRepository,
    ) {
    }

    async execute(command: DeleteOtherSessionsUseCaseCommand) {

        const session = await this.sessionQueryRepository.getUserSession(command.userId, command.deviceId);

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        return await this.sessionRepository.deleteOtherSessions(command.userId, command.deviceId);
    }

}