import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {BasicStrategy as Strategy} from 'passport-http';
import {basicConstants} from "../../features/auth/constants";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (req, username, password): Promise<boolean> => {
        const basicAuthUsername = this.configService.get<string>('basicAuthSettings.BASIC_AUTH_USERNAME');
        const basicAuthPassword = this.configService.get<string>('basicAuthSettings.BASIC_AUTH_PASSWORD');

        if (basicAuthUsername === username && basicAuthPassword === password) {
            return true;
        }

        throw new UnauthorizedException();
    }
}