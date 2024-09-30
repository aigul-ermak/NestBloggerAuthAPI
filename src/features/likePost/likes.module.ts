import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Like, LikesEntity} from "./domain/like.entity";
import {LikesRepository} from "./infrastructure/likes.repository";
import {LikesQueryRepository} from "./infrastructure/likes.query-repository";
import {PostsModule} from "../posts/posts.module";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Like.name, schema: LikesEntity}]),
        PostsModule
    ],
    providers: [LikesRepository, LikesQueryRepository],
})
export class LikesModule {
}
