import {Controller, Get, HttpCode} from '@nestjs/common';
import {CommandBus} from "@nestjs/cqrs";

@Controller('security')
export class SecurityController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Get('/devices')
    @HttpCode(200)
    async getAllDevices() {

        await this.commandBus.execute(new GetAllDevicesWithActiveSessionsUseCaseCommand(createUserDto));

    }

}
