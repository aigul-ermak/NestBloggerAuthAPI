import {Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Put, Req, UseGuards} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {BasicAuthGuard} from "../../../../infrastructure/guards/basic-auth.guard";
import {JwtAuthGuard} from "../../../../infrastructure/guards/jwt-auth.guard";
import {LikeStatusInputDto} from "../../../likePost/api/model/like-status.input.dto";
import {Request} from "express";
import {CommentInputDto} from "./input/comment-input.dto";
import {UpdateCommentUseCaseCommand} from "../../../usecases/updateCommentUseCase";
import {DeleteCommentByIdUseCaseCommand} from "../../../usecases/deleteCommentByIdUseCase";
import {CreateLikeForCommentUseCaseCommand} from "../../../usecases/createLikeForCommentUseCase";
import {GetCommentByIdUseCaseCommand} from "../../../usecases/getCommentByIdUseCase";
import {JwtAuthNullableGuard} from "../../../auth/infrastucture/jwt-auth-nullable.guard";

@Controller('comments')
export class CommentsController {
    constructor(
        private commandBus: CommandBus,
    ) {
    }

    @Get(':id')
    @UseGuards(JwtAuthNullableGuard)
    async getCommentById(@Param('id') id: string,
                         @Req() req: Request) {

        const userId = req['userId'];

        return await this.commandBus.execute(new GetCommentByIdUseCaseCommand(id, userId));

    }

    @Put(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @Param('id') id: string,
        @Body() updateCommentDto: CommentInputDto,
        @Req() req,
    ) {
        const userId = req['userId'];

        return await this.commandBus.execute(
            new UpdateCommentUseCaseCommand(id, updateCommentDto, userId));

    }


    @Put(':id/like-status')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async createLikeForComment(
        @Param('id') commentId: string,
        @Body() likeStatus: LikeStatusInputDto,
        @Req() req: Request
    ) {
        const userId = req['userId'];

        return await this.commandBus.execute(
            new CreateLikeForCommentUseCaseCommand(commentId, likeStatus, userId));
    }

    @Delete(':id')
    @HttpCode(204)
    // @UseGuards(BasicAuthGuard)
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('id') id: string, @Req() req: Request): Promise<void> {
        const userId = req['userId'];

        const result = await this.commandBus.execute(
            new DeleteCommentByIdUseCaseCommand(id, userId));

        if (!result) {
            throw new NotFoundException(`Post not found`);
        }
    }

}