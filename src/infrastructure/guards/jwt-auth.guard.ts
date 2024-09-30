import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {jwtAccessConstants} from "../../features/auth/constants";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {secret: jwtAccessConstants.jwt_secret});
            request['userId'] = decoded.id;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
