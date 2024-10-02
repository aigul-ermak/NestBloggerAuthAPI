import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {ExtractJwt} from 'passport-jwt';
import {ConfigService} from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false,
            // secretOrKey: jwtAccessConstants.jwt_secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwtSettings.JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: any) {
        return {userId: payload.sub, username: payload.username};
    }
}