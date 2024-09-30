import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {Response} from 'express';
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {AuthGuard} from "../../../infrastructure/guards/auth.guard";
import {ResendEmailDto} from "../../email/models/input/email.input.dto";
import {CommandBus} from "@nestjs/cqrs";
import {LoginUserUseCaseCommand} from "../../usecases/loginUserUseCase";
import {ConfirmEmailUseCaseCommand} from "../../usecases/confirmEmailUseCase";
import {CreateUserRegistrationUseCaseCommand} from "../../usecases/createUserRegistrationUseCase";
import {SendNewCodeToEmailUseCaseCommand} from "../../usecases/sendNewCodeToEmailUseCase";
import {GetMeUseCaseCommand} from "../../usecases/getMeUseCase";


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

    @UseGuards(AuthGuard)
    @Get('/me')
    @HttpCode(200)
    async getUser(
        @Req() req: Request
    ) {
        const userId = req['user']?.id;

        const userLogin = req['user'].login;

        const result = this.commandBus.execute(new GetMeUseCaseCommand(userId));

        return result;
    }
}

