import {
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
    UseGuards,
} from '@nestjs/common';
import {BlogInputDto, CreatePostToBlogDto,} from './models/input/blog-input.dto';
import {CreateBlogUseCaseCommand} from "./usecases/createBlogUseCase";
import {GetBlogByIdUseCaseCommand} from "./usecases/getBlogByIdUseCase";
import {BlogOutputModel} from "./models/output/blogOutputModel";
import {BasicAuthGuard} from "../../../infrastructure/guards/basic-auth.guard";
import {SortBlogsDto} from "./models/input/sort-blog.input.dto";
import {GetAllBlogsUseCaseCommand} from "./usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCaseCommand} from "./usecases/deleteBlogByIdUseCase";
import {CommandBus} from "@nestjs/cqrs";
import {UpdateBlogUseCaseCommand} from "./usecases/updateBlogUseCase";
import {SortPostsDto} from "../../posts/api/models/input/sort-post.input.dto";
import {GetAllPostsForBlogUseCaseCommand} from "./usecases/getAllPostsForBlogUseCase";
import {JwtAuthNullableGuard} from "../../auth/infrastucture/jwt-auth-nullable.guard";
import {Request} from "express";
import {CreatePostUseCaseCommand} from "../../posts/api/usecases/createPostUseCase";
import {PostToBlogInputType} from "../../posts/api/models/types/input/createPostToBlogInputType";
import {PostMdOutputType} from "../../posts/api/models/types/output/postMdOutputType";
import {GetAllBlogOutputType} from "./models/types/getAllBlogOutputType";
import {GetAllPostsForBlogOutputType} from "./models/types/getAllPostsForBlogOutputType";

@Controller('blogs')
export class BlogsController {

    constructor(
        private commandBus: CommandBus,
    ) {
    }


    @Post()
    @UseGuards(BasicAuthGuard)
    async create(
        @Body()
            createBlogDto: BlogInputDto,
    ): Promise<BlogOutputModel> {

        const newBlogId: string = await this.commandBus.execute(new CreateBlogUseCaseCommand(createBlogDto));

        const blog: BlogOutputModel | null = await this.commandBus.execute(new GetBlogByIdUseCaseCommand(newBlogId));

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }


    @Put(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async updateBlog(
        @Param('id') id: string,
        @Body() updateBlogDto: BlogInputDto,
    ): Promise<void> {

        return this.commandBus.execute(new UpdateBlogUseCaseCommand(id, updateBlogDto));

    }

    @Post(':id/posts')
    @UseGuards(BasicAuthGuard)
    async createPostForBlog(
        @Param('id') blogId: string,
        @Body()
            createPostToBlogDto: CreatePostToBlogDto,
    ): Promise<PostMdOutputType> {

        const createdPost: PostToBlogInputType = {
            ...createPostToBlogDto,
            blogId,
        }

        return await this.commandBus.execute(new CreatePostUseCaseCommand(createdPost));

    }

    @Get()
    async getAllBlogs(
        @Query() sortData: SortBlogsDto): Promise<GetAllBlogOutputType> {
        return this.commandBus.execute(new GetAllBlogsUseCaseCommand(sortData));
    }

    @Get(':id/posts')
    @UseGuards(JwtAuthNullableGuard)
    async getPostsForBlog(
        @Param('id') blogId: string,
        @Query() sortData: SortPostsDto,
        @Req() req: Request
    ): Promise<GetAllPostsForBlogOutputType> {
        const userId = req['userId'];

        return await this.commandBus.execute(new GetAllPostsForBlogUseCaseCommand(blogId, sortData, userId));
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string): Promise<BlogOutputModel> {
        return this.commandBus.execute(new GetBlogByIdUseCaseCommand(id));
    }


    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteBlog(@Param('id') blogId: string): Promise<void> {

        return this.commandBus.execute(
            new DeleteBlogByIdUseCaseCommand(blogId)
        );
    }
}
