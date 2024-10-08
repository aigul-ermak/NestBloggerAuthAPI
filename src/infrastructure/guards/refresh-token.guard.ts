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
        console.log(123)
        const request = context.switchToHttp().getRequest<Request>();
        const refreshToken = request.cookies?.refreshToken;
        const refreshSecret = this.configService.get<string>('jwtSettings.JWT_REFRESH_SECRET');
        console.log(request.cookies, " refreshTokne")
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found');
        }

        try {
            const decoded = this.jwtService.verify(refreshToken, {secret: refreshSecret});
            const {id, userIP, userDevice, userAgent} = decoded
            request['userId'] = id;
            request['userIP'] = userIP;
            request['userDevice'] = userDevice;
            request['userAgent'] = userAgent;

            const iatDate = new Date(decoded.iat * 1000);

            const session = await this.sessionQueryRepository.getUserSession(id, userDevice)
            console.log("session", session)
            console.log("iatDate", iatDate)
            console.log("condition", session?.iatDate.toISOString() !== iatDate.toISOString())
            if (session?.iatDate.toISOString() !== iatDate.toISOString()) throw new Error('TokenExpiredError')


            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }

            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
