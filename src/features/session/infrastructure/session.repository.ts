import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Session, SessionDocument} from "../domain/session.entity";


@Injectable()
export class SessionRepository {
    constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {
    }

    //TODO
    async createSession(sessionUser: any) {

        const result = await this.sessionModel.create(sessionUser);

        return result._id.toString();
    }

    async deleteSession(userId: string, deviceId: string) {

        const result = await this.sessionModel.deleteOne({userId, deviceId});

        return result.deletedCount > 0;
    }
}