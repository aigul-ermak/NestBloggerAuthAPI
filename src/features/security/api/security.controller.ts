import {Controller, Delete, Get, HttpCode, Param, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {CommandBus} from "@nestjs/cqrs";
import {GetAllDevicesWithActiveSessionsUseCaseCommand} from "./usecases/getAllDevicesWithActiveSessionsUseCase";
import {RefreshTokenGuard} from "../../../infrastructure/guards/refresh-token.guard";
import {Request} from "express";
import {DeleteDeviceSessionUseCaseCommand} from "../../auth/api/usecases/deleteDeviceSessionUseCase";
import {DeleteOtherSessionsUseCaseCommand} from "./usecases/deleteOtherSessionsUseCase";

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

        if (!request.user) throw new UnauthorizedException('User info was not provided')

        const {userId} = request.user;

        const activeSessions = await this.commandBus.execute(new GetAllDevicesWithActiveSessionsUseCaseCommand(userId));

        return activeSessions;
    }

    @Delete('/devices')
    @HttpCode(204)
    @UseGuards(RefreshTokenGuard)
    async deleteOtherSessions(
        @Req() request: Request,
    ) {

        if (!request.user) throw new UnauthorizedException('User info was not provided')

        const {userId, deviceId} = request.user

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

        if (!request.user) throw new UnauthorizedException('User info was not provided');

        const {deviceId: tokenDeviceId, userId} = request.user

        return this.commandBus.execute(
            new DeleteDeviceSessionUseCaseCommand(userId, deviceId)
        );

    }
}
