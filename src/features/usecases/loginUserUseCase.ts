import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {UserLoginDto} from "../auth/api/models/input/login-user.input.dto";
import {UnauthorizedException} from "@nestjs/common";
import bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";


export class LoginUserUseCaseCommand {
    constructor(
        public loginDto: UserLoginDto,
        public userIP: string,
        public userDevice: string,
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
        private configService: ConfigService
    ) {
    }

    async execute(command: LoginUserUseCaseCommand) {

        const accessSecret = this.configService.get<string>('jwtSettings.JWT_ACCESS_SECRET');
        const accessExpiry = this.configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY');

        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');
        const refreshExpiry = this.configService.get<string>('jwtSettings.REFRESH_TOKEN_EXPIRY');


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
            userDevice: command.userDevice,
            userAgent: command.userAgent

        }, {secret: refreshSecret, expiresIn: refreshExpiry});

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
