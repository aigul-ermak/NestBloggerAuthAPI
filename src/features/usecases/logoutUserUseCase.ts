import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {JwtService} from "@nestjs/jwt";
import {RefreshToken} from "../users/api/models/input/refresh-token.model";


export class LogoutUserUseCaseCommand {
    constructor(
        public refreshToken: RefreshToken
    ) {
    }
}

@CommandHandler(LogoutUserUseCaseCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private jwtService: JwtService,
    ) {
    }

    async execute(command: LogoutUserUseCaseCommand) {

        // const payload: RefreshToken | null = this.jwtService.decode(command.refreshToken.expDate) as RefreshToken;
        //
        //
        // if (!payload) {
        //     throw new UnauthorizedException('Invalid refresh token');
        // }

        // const userId: string = payload.userId;
        // const deviceId: string = payload.deviceId;

        // console.log({userId, deviceId})
        console.log('inside use case')

        //const result = await this.querySecurityRepo.deleteSessionFromList(userId, deviceId);


        // if (!result) {
        //     throw new UnauthorizedException('Failed to revoke refresh token');
        // }

        return true;
    }


}
