import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {PostsModule} from "../posts/posts.module";
import {LikesCommentRepository} from "./infrastructure/likes-comment.repository";
import {LikesCommentQueryRepository} from "./infrastructure/likes-comment.query-repository";
import {LikeComment, LikesCommentEntity} from "./domain/like-comment.entity";

@Module({
    imports: [
        MongooseModule.forFeature([{name: LikeComment.name, schema: LikesCommentEntity}]),
        PostsModule
    ],
    providers: [LikesCommentRepository, LikesCommentQueryRepository],
    exports: [LikesCommentRepository, LikesCommentQueryRepository]

})
export class LikesCommentModule {
}
