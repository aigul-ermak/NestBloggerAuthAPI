import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {Request} from 'express';
import {CreatePostForBlogInputDto} from './models/input/create-post.input.dto';
import {CommandBus} from "@nestjs/cqrs";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth.guard";
import {UpdatePostUseCaseCommand} from "./usecases/updatePostUseCase";
import {SortPostsDto} from "./models/input/sort-post.input.dto";
import {GetAllPostsUseCaseCommand} from "./usecases/getAllPostsUseCase";
import {DeletePostByIdUseCaseCommand} from "./usecases/deletePostByIdUseCase";
import {CreateLikeForPostUseCaseCommand} from "./usecases/createLikeForPostUseCase";
import {LikeStatusInputDto} from "../../likePost/api/model/like-status.input.dto";
import {JwtAuthGuard} from "../../../infrastructure/guards/jwt-auth.guard";
import {CreateCommentForPostUseCaseCommand} from "./usecases/createCommentForPostUseCase";
import {CommentInputDto} from "../../comments/api/model/input/comment-input.dto";
import {GetCommentsForPostUseCaseCommand} from "./usecases/getCommentsForPostUseCase";
import {JwtAuthNullableGuard} from "../../auth/infrastucture/jwt-auth-nullable.guard";
import {GetPostByIdUseCaseCommand} from "./usecases/getPostByIdUseCase";
import {CreatePostUseCaseCommand} from "./usecases/createPostUseCase";
import {PostOutputModel} from "./models/output/postDbOutputModel";
import {GetAllPostsForBlogOutputType} from "../../blogs/api/models/types/getAllPostsForBlogOutputType";
import {GetAllCommentsForPostOutputType} from "../../blogs/api/models/types/getAllCommentsForPostOutputType.ts";
import {Types} from "mongoose";


class GetCommentsPostUseCaseCommand {
    constructor(sortData: SortPostsDto) {

    }

}

@Controller('posts')
export class PostsController {
    constructor(
        private commandBus: CommandBus,
    ) {
    }


    @Post()
    @UseGuards(BasicAuthGuard)
    async create(
        @Body()
            createPostDto: CreatePostForBlogInputDto,
    ): Promise<PostOutputModel> {
        return await this.commandBus.execute(
            new CreatePostUseCaseCommand(createPostDto)
        );
    }


    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: CreatePostForBlogInputDto,
    ) {

        return await this.commandBus.execute(new UpdatePostUseCaseCommand(id, updatePostDto));

    }


    @Put(':id/like-status')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async createLikeForPost(
        @Param('id') postId: string,
        @Body() likeStatus: LikeStatusInputDto,
        @Req() req: Request
    ) {
        // const userId = req['userId'];
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User ID is missing');
        }
        if (!Types.ObjectId.isValid(postId)) {
            throw new BadRequestException(`Invalid ID format`);
        }

        return await this.commandBus.execute(
            new CreateLikeForPostUseCaseCommand(postId, likeStatus, userId));
    }


    @Get(':id')
    @HttpCode(200)
    @UseGuards(JwtAuthNullableGuard)
    async getPostById(
        @Param('id') id: string,
        @Req() req: Request): Promise<PostOutputModel> {
        const userId = req['userId'];
        // const userId = req.user?.userId;

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid ID format`);
        }
        // if (!userId) {
        //     throw new UnauthorizedException('User ID is missing');
        // }

        return await this.commandBus.execute(new GetPostByIdUseCaseCommand(id, userId!));
    }

    @Post(':id/comments')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async createCommentForPost(
        @Param('id') postId: string,
        @Body() comment: CommentInputDto,
        @Req() req: Request,
    ): Promise<void> {
        //const userId = req['userId'];
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User ID is missing');
        }

        await this.commandBus.execute(new CreateCommentForPostUseCaseCommand(postId, userId.toString(), comment));
    }

    @Get(':id/comments')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthNullableGuard)
    async getCommentsForPost(
        @Param('id') postId: string,
        @Query() sortData: SortPostsDto,
        @Req() req: Request
    ): Promise<GetAllCommentsForPostOutputType> {
        // const userId = req['userId'];
        const userId = req.user?.userId;

        return await this.commandBus.execute(
            new GetCommentsForPostUseCaseCommand(postId, sortData, userId!)
        );

    }


    @Get()
    //@UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthNullableGuard)
    async getAllPosts(
        @Query() sortData: SortPostsDto,
        @Req() req: Request): Promise<GetAllPostsForBlogOutputType> {

        const userId = req['userId'];

        return await this.commandBus.execute(new GetAllPostsUseCaseCommand(sortData, userId));

    }


    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deletePost(@Param('id') id: string): Promise<void> {

        const result = await this.commandBus.execute(new DeletePostByIdUseCaseCommand(id));

        if (!result) {
            throw new NotFoundException(`Post not found`);
        }
    }
}
