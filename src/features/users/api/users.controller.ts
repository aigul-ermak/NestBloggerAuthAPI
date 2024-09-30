import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query, UseGuards,
} from '@nestjs/common';
import {CreateUserDto} from "./models/input/create-user.input.dto";
import {UserOutputModel} from "./models/output/user.output.model";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth.guard";
import {SortUserDto} from "./models/output/sort.user.dto";
import {CreateUserUseCaseCommand} from "../../usecases/createUserUseCase";
import {CommandBus} from "@nestjs/cqrs";
import {GetAllUsersUseCaseCommand} from "../../usecases/getAllUsersUseCase";
import {DeleteUserByIdUseCaseCommand} from "../../usecases/deleteUserByIdUseCase";

@Controller('users')
export class UsersController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserOutputModel> {

        return await this.commandBus.execute(new CreateUserUseCaseCommand(createUserDto));
    }

    @Get()
    @UseGuards(BasicAuthGuard)
    async getAllUsers(@Query() sortData: SortUserDto) {

        return await this.commandBus.execute(new GetAllUsersUseCaseCommand(sortData));

    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {

        return await this.commandBus.execute(new DeleteUserByIdUseCaseCommand(id));

    }
}
