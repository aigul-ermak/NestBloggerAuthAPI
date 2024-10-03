import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {UserLoginDto} from "../auth/api/models/input/login-user.input.dto";
import {UnauthorizedException} from "@nestjs/common";
import bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {v4 as uuidv4} from "uuid";
import {SessionRepository} from "../session/infrastructure/session.repository";


export class LoginUserUseCaseCommand {
    constructor(
        public loginDto: UserLoginDto,
        public userIP: string,
        public userAgent: string
    ) {
    }
}

@CommandHandler(LoginUserUseCaseCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserUseCaseCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionRepository: SessionRepository,
    ) {
    }

    async execute(command: LoginUserUseCaseCommand) {

        const accessSecret = this.configService.get<string>('jwtSettings.JWT_ACCESS_SECRET');
        const accessExpiry = this.configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY');

        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');
        const refreshExpiry = this.configService.get<string>('jwtSettings.REFRESH_TOKEN_EXPIRY');

        const userDevice = uuidv4();

        const user = await this.validateUser(
            command.loginDto.loginOrEmail,
            command.loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {loginOrEmail: command.loginDto.loginOrEmail, id: user.id};

        const accessToken = this.jwtService.sign(payload, {});

        const refreshToken = this.jwtService.sign({
            id: user.id,
            userIP: command.userIP,
            userDevice: userDevice,
            userAgent: command.userAgent

        }, {secret: refreshSecret, expiresIn: refreshExpiry});

        const decodedToken = this.jwtService.decode(refreshToken) as { iat: number, exp: number };

        if (!decodedToken) {
            throw new Error('Failed to decode refresh token');
        }

        console.log(decodedToken)

        const iatDate = new Date(decodedToken.iat * 1000);
        const expDate = new Date(decodedToken.exp * 1000);

        const sessionUser = {
            userId: user.id,
            deviceId: userDevice,
            ip: command.userIP,
            title: command.userAgent,
            iatDate: iatDate,
            expDate: expDate
        }

        await this.sessionRepository.createSession(sessionUser);

        return {accessToken, refreshToken};

    }

    private async validateUser(loginOrEmail: string, password: string) {
//TODO type
        const user: any = await this.usersQueryRepository.findOneByLoginOrEmail(loginOrEmail);

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
