import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {AuthService} from "./application/auth.service";
import {AuthController} from "./api/auth.controller";
import {jwtAccessConstants} from "./constants";
import {APP_GUARD} from "@nestjs/core";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {LocalStrategy} from "../../infrastructure/guards/local.strategy";
import {BasicStrategy} from "../../infrastructure/guards/basic.strategy";
import {EmailModule} from "../email/email.module";

@Module
({
    imports: [
        UsersModule,
        EmailModule,
        JwtModule.register({
            global: true,
            secret: jwtAccessConstants.jwt_secret,
            signOptions: {expiresIn: jwtAccessConstants.access_token_expiry},
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtService, BasicStrategy],
    exports: [AuthService],
})

export class AuthModule {
}
