import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {jwtAccessConstants} from "../../features/auth/constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        //const token = this.extractTokenFromHeader(request);
        const {authorization}: any = request.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new UnauthorizedException('No valid token found');
        }

        const token = authorization.split(' ')[1];
        console.log(token);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtAccessConstants.jwt_secret
                }
            );

            request['user'] = payload;
            console.log(payload)

        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}