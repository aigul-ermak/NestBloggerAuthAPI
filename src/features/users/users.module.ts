import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UsersEntity} from './domain/users.entity';
import {UsersService} from './application/users.service';
import {UsersRepository} from './infrastructure/users.repository';
import {UsersQueryRepository} from "./infrastructure/users.query-repository";


@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UsersEntity}]),
    ],
    providers: [UsersService, UsersRepository, UsersQueryRepository],
    exports: [UsersService, UsersQueryRepository, UsersRepository]
})
export class UsersModule {
}
