import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {ConfigService} from "@nestjs/config";


@Injectable()
export class JwtAuthNullableGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private configService: ConfigService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const accessSecret = this.configService.get<string>('jwtSettings.JWT_ACCESS_SECRET');
        const accessExpiry = this.configService.get<string>('jwtSettings.ACCESS_TOKEN_EXPIRY');

        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            request['userId'] = null;
            return true;
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {secret: accessSecret});
            // request['userId'] = decoded.id;
            console.log("decode", decoded)

            request['user'] = {
                userId: decoded.id,
                deviceId: decoded.deviceId,
                userIP: request.ip ?? 'testip',
                userAgent: request.headers['user-agent'] ?? 'test-user-agent'
            };
            console.log("user", request['user'])
            return true;
        } catch (error) {

            // request['userId'] = null;
            request['user'] = {
                userId: "",
                deviceId: "",
                userIP: "",
                userAgent: ""
            };
            return true;
        }
    }
}
