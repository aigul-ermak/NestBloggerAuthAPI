import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {SessionRepository} from "../session/infrastructure/session.repository";
import {SessionQueryRepository} from "../session/infrastructure/session.query-repository";

export class DeleteDeviceSessionUseCaseCommand {
    constructor(
        public userId: string,
        public deviceId: string) {
    }
}

@CommandHandler(DeleteDeviceSessionUseCaseCommand)
export class DeleteDeviceSessionUseCase implements ICommandHandler<DeleteDeviceSessionUseCaseCommand> {
    constructor(
        private sessionRepository: SessionRepository,
        private sessionQueryRepository: SessionQueryRepository,
    ) {
    }

    async execute(command: DeleteDeviceSessionUseCaseCommand) {

        const session = await this.sessionQueryRepository.getUserSessionByDeviceId(command.deviceId);

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (command.userId !== session.userId) {
            throw new ForbiddenException('Session deletion denied');
        }

        return await this.sessionRepository.deleteSession(command.userId, command.deviceId);

    }

}