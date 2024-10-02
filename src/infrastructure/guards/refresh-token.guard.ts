import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private configService: ConfigService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const refreshToken = request.cookies?.refreshToken;
        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }

        try {
            const decoded = this.jwtService.verify(refreshToken, {secret: refreshSecret});
            request['userId'] = decoded.id;
            request['userIP'] = decoded.userIP;
            request['userDevice'] = decoded.userDevice;
            request['userAgent'] = decoded.userAgent;

            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
