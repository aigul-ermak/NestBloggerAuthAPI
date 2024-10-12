import {Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards,} from '@nestjs/common';

import {Request, Response} from 'express';
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {EmailDto} from "../../email/models/input/email.input.dto";
import {CommandBus} from "@nestjs/cqrs";
import {LoginUserUseCaseCommand} from "./usecases/loginUserUseCase";
import {ConfirmEmailUseCaseCommand} from "./usecases/confirmEmailUseCase";
import {CreateUserRegistrationUseCaseCommand} from "./usecases/createUserRegistrationUseCase";
import {SendNewCodeToEmailUseCaseCommand} from "./usecases/sendNewCodeToEmailUseCase";
import {GetMeUseCaseCommand} from "./usecases/getMeUseCase";
import {LogoutUserUseCaseCommand} from "./usecases/logoutUserUseCase";
import {JwtAuthGuard} from "../../../infrastructure/guards/jwt-auth.guard";
import {RefreshTokenGuard} from "../../../infrastructure/guards/refresh-token.guard";
import {RefreshTokensUseCaseCommand} from "./usecases/refreshTokensUserUseCase";
import {Throttle} from "@nestjs/throttler";
import {PasswordRecoveryUseCaseCommand} from "./usecases/passwordRecoveryUseCase";
import {NewPasswordDto} from "./models/input/new-password.input.dto";
import {CreateNewPasswordUseCaseCommand} from "./usecases/createNewPasswordUseCase";


@Controller('auth')
export class AuthController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Throttle({default: {limit: 5, ttl: 10000}})
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: UserLoginDto,
                @Req() req: Request,
                @Res() res: Response,) {

        const userIP: string = req.ip ?? "testuserip";
        const userAgent: string = req.headers['user-agent'] ?? "user-agent";

        const {
            accessToken,
            refreshToken
        } = await this.commandBus
            .execute(new LoginUserUseCaseCommand(loginDto, userIP, userAgent));

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({accessToken});

    }

    @Throttle({default: {limit: 5, ttl: 10000}})
    @Post('/password-recovery')
    @HttpCode(200)
    async recoveryPassword(
        @Body() email: EmailDto) {

        await this.commandBus.execute(new PasswordRecoveryUseCaseCommand(email));

    }

    @Post('/new-password')
    async createNewPassword(
        @Body()
            newPasswordDto: NewPasswordDto) {

        await this.commandBus.execute(new CreateNewPasswordUseCaseCommand(newPasswordDto));

    }


    @Throttle({default: {limit: 5, ttl: 10000}})
    @Post('/registration-confirmation')
    @HttpCode(204)
    async confirmRegistration(@Body('code') code: string) {

        await this.commandBus.execute(new ConfirmEmailUseCaseCommand(code));

    }

    @Throttle({default: {limit: 5, ttl: 10000}})
    @Post('/registration')    // @UseGuards(ThrottlerGuard)
    @HttpCode(204)
    async registration(
        @Body() createUserDto: CreateUserDto) {

        await this.commandBus.execute(new CreateUserRegistrationUseCaseCommand(createUserDto));

    }

    @Post('/refresh-token')
    @HttpCode(200)
    @UseGuards(RefreshTokenGuard)
    async refreshToken(
        @Req() request: Request,
        @Res() res: Response) {

        if (!request.user) throw new UnauthorizedException('User info was not provided')
        const {userId, deviceId, userIP, userAgent} = request.user

        const {
            accessToken,
            refreshToken
        } = await this.commandBus.execute(new RefreshTokensUseCaseCommand(userId, deviceId, userIP, userAgent));


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({accessToken});
    }

    @Throttle({default: {limit: 5, ttl: 10000}})
    @Post('/registration-email-resending')
    @HttpCode(204)
    async sendNewCodeToEmail(@Body() resendEmailDto: EmailDto) {

        await this.commandBus.execute(new SendNewCodeToEmailUseCaseCommand(resendEmailDto));

    }


    @Get('/me')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getUser(
        @Req() request: Request
    ) {
        if (!request.user) throw new UnauthorizedException('User info was not provided')

        const {userId} = request.user;

        return this.commandBus.execute(new GetMeUseCaseCommand(userId));

    }

    @Post('/logout')
    @HttpCode(204)
    @UseGuards(RefreshTokenGuard)
    async logoutUser(
        @Req() request: Request, @Res() res: Response) {

        if (!request.user) throw new UnauthorizedException('User info was not provided')

        const {userId, deviceId} = request.user

        await this.commandBus.execute(new LogoutUserUseCaseCommand(userId, deviceId));

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.send();
    }
}

