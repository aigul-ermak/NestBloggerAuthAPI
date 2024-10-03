import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Session, SessionEntity} from "./domain/session.entity";
import {SessionRepository} from "./infrastructure/session.repository";
import {SessionQueryRepository} from "./infrastructure/session.query-repository";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Session.name, schema: SessionEntity}])
    ],
    providers: [SessionRepository, SessionQueryRepository],
    exports: [SessionRepository, SessionQueryRepository]

})
export class SessionModule {
}
