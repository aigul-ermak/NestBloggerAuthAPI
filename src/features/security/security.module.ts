import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {SessionModule} from "../session/session.module";

@Module({
    imports: [
        UsersModule,
        SessionModule,
    ],
    providers: [],
    exports: [],

})

export class SecurityModule {
}