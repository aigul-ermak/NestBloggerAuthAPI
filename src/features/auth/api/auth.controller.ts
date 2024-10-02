import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';

import {Request, Response} from 'express';
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {ResendEmailDto} from "../../email/models/input/email.input.dto";
import {CommandBus} from "@nestjs/cqrs";
import {LoginUserUseCaseCommand} from "../../usecases/loginUserUseCase";
import {ConfirmEmailUseCaseCommand} from "../../usecases/confirmEmailUseCase";
import {CreateUserRegistrationUseCaseCommand} from "../../usecases/createUserRegistrationUseCase";
import {SendNewCodeToEmailUseCaseCommand} from "../../usecases/sendNewCodeToEmailUseCase";
import {GetMeUseCaseCommand} from "../../usecases/getMeUseCase";
import {LogoutUserUseCaseCommand} from "../../usecases/logoutUserUseCase";
import {JwtAuthGuard} from "../../../infrastructure/guards/jwt-auth.guard";
import {RefreshTokenGuard} from "../../../infrastructure/guards/refresh-token.guard";


@Controller('auth')
export class AuthController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: UserLoginDto,
                @Res() res: Response,) {

        const userIP: string = "testuserip";
        const userDevice: string = "testdeviceid";
        const userAgent: string = "user-agent";

        const {
            accessToken,
            refreshToken
        } = await this.commandBus.execute(new LoginUserUseCaseCommand(loginDto, userIP, userDevice, userAgent));

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({accessToken});

    }

    //
// @Post('/password-recovery')
// async recoveryPassword(
//     @Body()
//     loginUserDto: loginUserDto) {
//
// }

    //
// @Post('/new-password')
// async createNewPassword(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }
//

    @Post('/registration-confirmation')
    @HttpCode(204)
    async confirmRegistration(@Body('code') code: string) {

        await this.commandBus.execute(new ConfirmEmailUseCaseCommand(code));

    }

    @Post('/registration')
    @HttpCode(204)
    async registration(
        @Body() createUserDto: CreateUserDto) {

        await this.commandBus.execute(new CreateUserRegistrationUseCaseCommand(createUserDto));

    }

    @Post('/registration-email-resending')
    @HttpCode(204)
    async sendNewCodeToEmail(@Body() resendEmailDto: ResendEmailDto) {

        await this.commandBus.execute(new SendNewCodeToEmailUseCaseCommand(resendEmailDto));

    }


    @Get('/me')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async getUser(
        @Req() request: Request
    ) {
        const userId = request['userId'];
        console.log(userId)

        const result = this.commandBus.execute(new GetMeUseCaseCommand(userId));

        return result;
    }

    @Post('/logout')
    @HttpCode(204)
    @UseGuards(RefreshTokenGuard)
    async logoutUser(
        @Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }

        console.log('User ID:', req['userId']);
        console.log('User IP:', req['userIP']);
        console.log('User Device:', req['userDevice']);
        console.log('User Agent:', req['userAgent']);

        await this.commandBus.execute(new LogoutUserUseCaseCommand(refreshToken));

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

    }
}

