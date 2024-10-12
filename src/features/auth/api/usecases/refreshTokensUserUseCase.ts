import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {UnauthorizedException} from "@nestjs/common";
import bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {SessionRepository} from "../../../session/infrastructure/session.repository";
import {AccessTokenType, RefreshTokenType} from "../models/types/accessTokenType";
import {UserWithIdOutputModel} from "../../../users/api/models/output/user.output.model";


export class RefreshTokensUseCaseCommand {
    constructor(
        public userId: string,
        public deviceId: string,
        public userIP: string,
        public userAgent: string,
    ) {
    }
}

@CommandHandler(RefreshTokensUseCaseCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensUseCaseCommand> {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionRepository: SessionRepository,
    ) {
    }

    async execute(command: RefreshTokensUseCaseCommand) {

        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');
        const refreshExpiry = this.configService.get<string>('jwtSettings.REFRESH_TOKEN_EXPIRY');

        const user = await this.usersQueryRepository.getUserById(command.userId);

        const newPayload: AccessTokenType = {
            loginOrEmail: user?.email,
            id: command.userId,
            deviceId: command.deviceId,
        };

        const newAccessToken = this.jwtService.sign(newPayload, {});
        const refreshTokenPayload: RefreshTokenType = {
            userId: command.userId,
            userIP: command.userIP,
            deviceId: command.deviceId,
            userAgent: command.userAgent

        }

        const newRefreshToken = this.jwtService.sign(refreshTokenPayload, {
            secret: refreshSecret,
            expiresIn: refreshExpiry
        });

        const decodedToken = this.jwtService.decode(newRefreshToken) as { iat: number, exp: number };

        const iatDate = new Date(decodedToken.iat * 1000);
        const expDate = new Date(decodedToken.exp * 1000);


        const newSessionUser = {
            userId: command.userId,
            deviceId: command.deviceId,
            ip: command.userIP,
            title: command.userAgent,
            iatDate: iatDate,
            expDate: expDate
        }

        await this.sessionRepository.updateSession(newSessionUser);

        return {accessToken: newAccessToken, refreshToken: newRefreshToken};

    }

    private async validateUser(loginOrEmail: string, password: string) {

        const user: UserWithIdOutputModel | null = await this.usersQueryRepository.findOneByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = bcrypt.compare(password, user.accountData.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
