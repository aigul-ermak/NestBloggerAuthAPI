import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {AuthService} from "./application/auth.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {LocalStrategy} from "../../infrastructure/guards/local.strategy";
import {BasicStrategy} from "../../infrastructure/guards/basic.strategy";
import {EmailModule} from "../email/email.module";
import {ConfigService} from "@nestjs/config";
import {SessionModule} from "../session/session.module";

@Module
({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                console.log("++++++", configService.get<string>('jwtSettings.JWT_ACCESS_SECRET'))
                console.log("++++++", typeof configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY'))
                return {
                    secret: configService.get<string>('jwtSettings.JWT_ACCESS_SECRET'),

                    signOptions: {
                        expiresIn: configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY'),
                    }
                    ,
                }
            },
        }),
        UsersModule,
        EmailModule,
        SessionModule,
    ],
    providers: [AuthService, LocalStrategy, BasicStrategy],
    exports: [AuthService, JwtModule],
})

export class AuthModule {
}
