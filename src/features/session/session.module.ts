import {Module, Session} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {PostsModule} from "../posts/posts.module";
import {SessionEntity} from "./domain/session.entity";
import {SessionRepository} from "./infrastructure/session.repository";
import {SessionQueryRepository} from "./infrastructure/session.query-repository";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Session.name, schema: SessionEntity}]),
        PostsModule
    ],
    providers: [SessionRepository, SessionQueryRepository],
    exports: [SessionRepository, SessionQueryRepository]

})
export class SessionModule {
}
