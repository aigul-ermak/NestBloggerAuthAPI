import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {jwtAccessConstants} from "../../features/auth/constants";
import {ExtractJwt} from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtAccessConstants.jwt_secret,
        });
    }

    async validate(payload: any) {
        return {userId: payload.sub, username: payload.username};
    }
}