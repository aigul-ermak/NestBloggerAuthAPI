import {MiddlewareConsumer, Module, NestModule, Provider,} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersRepository} from './features/users/infrastructure/users.repository';
import {UsersService} from './features/users/application/users.service';
import {User, UsersEntity} from './features/users/domain/users.entity';
import {UsersController} from './features/users/api/users.controller';
import {LoggerMiddleware} from './infrastructure/middlewares/logger.middleware';
import {UsersModule} from "./features/users/users.module";
import {TestingModule} from "./features/testing/testing-module";
import {PostsModule} from "./features/posts/posts.module";
import {AuthModule} from './features/auth/auth.module';
import {AuthController} from './features/auth/api/auth.controller';
import {AuthService} from './features/auth/application/auth.service';
import {UsersQueryRepository} from "./features/users/infrastructure/users.query-repository";
import {EmailModule} from "./features/email/email.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration, {ConfigurationType} from "./settings/configuration";
import {CreateUserUseCase} from "./features/users/api/usecases/createUserUseCase";
import {CreateBlogUseCase} from "./features/blogs/api/usecases/createBlogUseCase";
import {GetBlogByIdUseCase} from "./features/blogs/api/usecases/getBlogByIdUseCase";
import {BlogsController} from "./features/blogs/api/blogs.controller";
import {PostsController} from "./features/posts/api/posts.controller";
import {BlogsRepository} from "./features/blogs/infrastructure/blogs.repository";
import {BlogsQueryRepository} from "./features/blogs/infrastructure/blogs.query-repository";
import {BlogsService} from "./features/blogs/application/blogs.service";
import {BlogsModule} from "./features/blogs/blogs.module";
import {Blog, BlogEntity} from "./features/blogs/domain/blog.entity";
import {GetAllBlogsUseCase} from "./features/blogs/api/usecases/getAllBlogsUseCase";
import {DeleteBlogByIdUseCase} from "./features/blogs/api/usecases/deleteBlogByIdUseCase";
import {CqrsModule} from "@nestjs/cqrs";
import {UpdateBlogUseCase} from "./features/blogs/api/usecases/updateBlogUseCase";
import {Post, PostsEntity} from "./features/posts/domain/posts.entity";
import {CreatePostUseCase} from "./features/posts/api/usecases/createPostUseCase";
import {PostsService} from "./features/posts/application/posts.service";
import {GetPostByIdUseCase} from "./features/posts/api/usecases/getPostByIdUseCase";
import {UpdatePostUseCase} from "./features/posts/api/usecases/updatePostUseCase";
import {GetAllPostsUseCase} from "./features/posts/api/usecases/getAllPostsUseCase";
import {DeletePostByIdUseCase} from "./features/posts/api/usecases/deletePostByIdUseCase";
import {GetAllPostsForBlogUseCase} from "./features/blogs/api/usecases/getAllPostsForBlogUseCase";
import {CreateLikeForPostUseCase} from "./features/posts/api/usecases/createLikeForPostUseCase";
import {LikesRepository} from "./features/likePost/infrastructure/likes.repository";
import {LikesQueryRepository} from "./features/likePost/infrastructure/likes.query-repository";
import {LikesModule} from "./features/likePost/likes.module";
import {Like, LikesEntity} from "./features/likePost/domain/like.entity";
import {LikesCommentModule} from './features/likeComment/likes-comment.module';
import {Comment, CommentsEntity} from "./features/comments/domain/comment.entity";
import {CommentsModule} from "./features/comments/comments.module";
import {GetCommentsForPostUseCase} from "./features/posts/api/usecases/getCommentsForPostUseCase";
import {CreateCommentForPostUseCase} from "./features/posts/api/usecases/createCommentForPostUseCase";
import {CommentsRepository} from "./features/comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "./features/comments/infrastructure/comments.query-repository";
import {CreateLikeForCommentUseCase} from "./features/comments/api/usecases/createLikeForCommentUseCase";
import {GetCommentByIdUseCase} from "./features/comments/api/usecases/getCommentByIdUseCase";
import {DeleteCommentByIdUseCase} from "./features/comments/api/usecases/deleteCommentByIdUseCase";
import {UpdateCommentUseCase} from "./features/comments/api/usecases/updateCommentUseCase";
import {LikesCommentRepository} from "./features/likeComment/infrastructure/likes-comment.repository";
import {LikesCommentQueryRepository} from "./features/likeComment/infrastructure/likes-comment.query-repository";
import {LikeComment, LikesCommentEntity} from "./features/likeComment/domain/like-comment.entity";
import {CommentsController} from "./features/comments/api/model/comments.controller";
import {GetAllUsersUseCase} from "./features/users/api/usecases/getAllUsersUseCase";
import {DeleteUserByIdUseCase} from "./features/users/api/usecases/deleteUserByIdUseCase";
import {LoginUserUseCase} from "./features/auth/api/usecases/loginUserUseCase";
import {ConfirmEmailUseCase} from "./features/auth/api/usecases/confirmEmailUseCase";
import {CreateUserRegistrationUseCase} from "./features/auth/api/usecases/createUserRegistrationUseCase";
import {SendNewCodeToEmailUseCase} from "./features/auth/api/usecases/sendNewCodeToEmailUseCase";
import {GetMeUseCase} from "./features/auth/api/usecases/getMeUseCase";
import {LogoutUserUseCase} from "./features/auth/api/usecases/logoutUserUseCase";
import {Session, SessionEntity} from "./features/session/domain/session.entity";
import {SessionModule} from "./features/session/session.module";
import {SessionRepository} from "./features/session/infrastructure/session.repository";
import {SessionQueryRepository} from "./features/session/infrastructure/session.query-repository";
import {RefreshTokensUseCase} from "./features/auth/api/usecases/refreshTokensUserUseCase";
import {SecurityModule} from './features/security/security.module';
import {SecurityController} from './features/security/api/security.controller';
import {
    GetAllDevicesWithActiveSessionsUseCase
} from "./features/security/api/usecases/getAllDevicesWithActiveSessionsUseCase";
import {DeleteDeviceSessionUseCase} from "./features/auth/api/usecases/deleteDeviceSessionUseCase";
import {DeleteOtherSessionUseCase} from "./features/security/api/usecases/deleteOtherSessionsUseCase";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {PasswordRecoveryUseCase} from "./features/auth/api/usecases/passwordRecoveryUseCase";
import {CreateNewPasswordUseCase} from "./features/auth/api/usecases/createNewPasswordUseCase";


const usersProviders: Provider[] = [UsersRepository, UsersQueryRepository, UsersService];
const blogsProviders: Provider[] = [BlogsRepository, BlogsQueryRepository, BlogsService]
const useCases = [CreateUserUseCase, CreateBlogUseCase, GetBlogByIdUseCase, GetAllBlogsUseCase,
    DeleteBlogByIdUseCase, UpdateBlogUseCase, CreatePostUseCase, GetPostByIdUseCase,
    UpdatePostUseCase, GetAllPostsUseCase, DeletePostByIdUseCase, GetAllPostsForBlogUseCase,
    CreateLikeForPostUseCase, GetCommentsForPostUseCase, CreateCommentForPostUseCase,
    CreateLikeForCommentUseCase, GetCommentByIdUseCase, DeleteCommentByIdUseCase, UpdateCommentUseCase,
    GetAllUsersUseCase, DeleteUserByIdUseCase, LoginUserUseCase, ConfirmEmailUseCase, CreateUserRegistrationUseCase,
    SendNewCodeToEmailUseCase, GetMeUseCase, LogoutUserUseCase, RefreshTokensUseCase, GetAllDevicesWithActiveSessionsUseCase,
    DeleteDeviceSessionUseCase, DeleteOtherSessionUseCase, PasswordRecoveryUseCase, CreateNewPasswordUseCase]

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 10,
            limit: 5,
        }]),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env.development.local', '.env.development', '.env'],
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService<ConfigurationType, true>) => {
                const environmentSettings = configService.get('environmentSettings', {
                    infer: true,
                });
                const databaseSettings = configService.get('databaseSettings', {
                    infer: true,
                });
                console.error("env", `"${JSON.stringify(environmentSettings)}"`)
                const uri = environmentSettings.isTesting
                    ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
                    : databaseSettings.MONGO_CONNECTION_URI;

                return {
                    uri
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            {name: User.name, schema: UsersEntity},
            {name: Blog.name, schema: BlogEntity},
            {name: Post.name, schema: PostsEntity},
            {name: Like.name, schema: LikesEntity},
            {name: Comment.name, schema: CommentsEntity},
            {name: LikeComment.name, schema: LikesCommentEntity},
            {name: Session.name, schema: SessionEntity}]
        ),

        CqrsModule,
        UsersModule,
        TestingModule,
        PostsModule,
        BlogsModule,
        AuthModule,
        EmailModule,
        LikesModule,
        LikesCommentModule,
        CommentsModule,
        SessionModule,
        SecurityModule,
    ],
    providers: [
        ...usersProviders, ...blogsProviders, AuthService, BlogsService, PostsService,
        LikesRepository, LikesQueryRepository, CommentsRepository, CommentsQueryRepository,
        LikesCommentRepository, LikesCommentQueryRepository, UsersQueryRepository, SessionRepository,
        SessionQueryRepository, ...useCases],
    controllers: [UsersController, AuthController, BlogsController, PostsController, CommentsController, SecurityController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
