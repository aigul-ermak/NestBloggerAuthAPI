import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {jwtAccessConstants} from "../constants";


@Injectable()
export class JwtAuthNullableGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            request['userId'] = null;
            return true;
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {secret: jwtAccessConstants.jwt_secret});
            request['userId'] = decoded.id;  // Set userId to the decoded token's id
            return true;
        } catch (error) {

            request['userId'] = null;
            return true;
        }
    }
}
