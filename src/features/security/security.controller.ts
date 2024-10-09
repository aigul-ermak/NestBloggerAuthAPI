import {Controller, Delete, Get, HttpCode, Param, Req, UseGuards} from '@nestjs/common';
import {CommandBus} from "@nestjs/cqrs";
import {GetAllDevicesWithActiveSessionsUseCaseCommand} from "../usecases/GetAllDevicesWithActiveSessionsUseCase";
import {RefreshTokenGuard} from "../../infrastructure/guards/refresh-token.guard";
import {Request} from "express";
import {BasicAuthGuard} from "../../infrastructure/guards/basic-auth.guard";
import {DeleteBlogByIdUseCaseCommand} from "../usecases/deleteBlogByIdUseCase";
import {DeleteDeviceSessionUseCaseCommand} from "../usecases/deleteDeviceSessionUseCase";
import {DeleteOtherSessionsUseCaseCommand} from "../usecases/DeleteOtherSessionsUseCase";

@Controller('security')
export class SecurityController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Get('/devices')
    @HttpCode(200)
    @UseGuards(RefreshTokenGuard)
    async getAllDevicesWithActiveSessions(
        @Req() request: Request
    ) {
        const userId = request['userId'];
        // console.log("userId", userId)
        const activeSessions = await this.commandBus.execute(new GetAllDevicesWithActiveSessionsUseCaseCommand(userId));

        return activeSessions;
    }

    @Delete('/devices')
    @HttpCode(204)
    @UseGuards(RefreshTokenGuard)
    async deleteOtherSessions(
        @Req() request: Request,
    ) {
        const userId = request['userId'];
        const deviceId = request['deviceId'];

        return this.commandBus.execute(
            new DeleteOtherSessionsUseCaseCommand(userId, deviceId)
        );

    }

    @Delete('/devices/:id')
    @HttpCode(204)
    @UseGuards(RefreshTokenGuard)
    async deleteDeviceSession(
        @Req() request: Request,
        @Param('id') deviceId: string) {
        const userId = request['userId'];

        return this.commandBus.execute(
            new DeleteDeviceSessionUseCaseCommand(userId, deviceId)
        );

    }
}
