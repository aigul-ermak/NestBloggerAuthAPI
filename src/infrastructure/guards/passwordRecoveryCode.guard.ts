import {BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UsersQueryRepository} from "../../features/users/infrastructure/users.query-repository";


@Injectable()
export class PasswordRecoveryCodeGuard implements CanActivate {
    constructor(private userQueryRepository: UsersQueryRepository) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const {recoveryCode} = request.body;

        if (!recoveryCode) {
            throw new BadRequestException('Recovery code is missing');
        }


        const user = await this.userQueryRepository.findUserByPasswordRecoveryCode(recoveryCode);

        if (!user || !user.accountData.recoveryCodeExpirationDate) {
            throw new BadRequestException('Invalid recovery code');
        }


        const currentTime = new Date();
        const expirationTime = new Date(user.accountData.recoveryCodeExpirationDate);

        if (currentTime > expirationTime) {
            throw new BadRequestException('Recovery code has expired');
        }


        return true;
    }
}