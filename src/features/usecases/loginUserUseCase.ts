import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {UserLoginDto} from "../auth/api/models/input/login-user.input.dto";
import {UnauthorizedException} from "@nestjs/common";
import {jwtRefreshConstants} from "../auth/constants";
import bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";


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
    ) {
    }

    async execute(command: LoginUserUseCaseCommand) {

        const user = await this.validateUser(
            command.loginDto.loginOrEmail,
            command.loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {loginOrEmail: command.loginDto.loginOrEmail, id: user.id};

        const accessToken = this.jwtService.sign(payload)

        const refreshToken = this.jwtService.sign({
            id: user.id,
            userIP: command.userIP,
            userDevice: command.userDevice,
            userAgent: command.userAgent

        }, {secret: jwtRefreshConstants.jwt_secret, expiresIn: jwtRefreshConstants.refresh_token_expiry});

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
