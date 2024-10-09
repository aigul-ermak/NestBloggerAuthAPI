import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {ConfigService} from "@nestjs/config";
import {SessionQueryRepository} from "../../features/session/infrastructure/session.query-repository";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private configService: ConfigService,
                private sessionQueryRepository: SessionQueryRepository,) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<Request>();
        const refreshToken = request.cookies?.refreshToken;
        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');

        // console.log(request.cookies, " refreshTokne")
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }

        try {
            const decoded = this.jwtService.verify(refreshToken, {secret: refreshSecret});

            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            // console.log('Current time:', new Date(currentTime * 1000).toISOString());
            // console.log('Token expiry time:', new Date(decoded.exp * 1000).toISOString());

            if (decoded.exp < currentTime) {
                console.log('Token has already expired.');
            } else {
                console.log('Token is still valid.');
            }
            //
            // console.log("decoded", decoded.iat)
            // console.log("decoded", decoded.exp)
            // console.log("userId", decoded.userId)
            const {userId, userIP, deviceId, userAgent} = decoded
            request['userId'] = userId;
            // console.log('id', userId)
            request['userIP'] = userIP;
            request['deviceId'] = deviceId;
            request['userAgent'] = userAgent;

            const iatDate = new Date(decoded.iat * 1000);
            const expDate = new Date(decoded.exp * 1000);

            const session = await this.sessionQueryRepository.getUserSession(userId, deviceId);
            if (!session) {
                throw new UnauthorizedException('Session not found');
            }
            // console.log("session", session)
            // console.log("iatDate", iatDate)
            // console.log("condition", session?.iatDate.toISOString() !== iatDate.toISOString())

            if (session.iatDate.toISOString() !== iatDate.toISOString()) {
                throw new UnauthorizedException('Invalid session iat date');
            }

            // console.log('Token issue date (iat):', iatDate);
            // console.log('Token expiration date (exp):', expDate);

            return true;
        } catch (error) {

            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }

            throw new UnauthorizedException('Invalid refresh token');

        }
    }
}
