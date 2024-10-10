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

    async updateSession(sessionUser: any) {

        const filter = {userId: sessionUser.userId, deviceId: sessionUser.deviceId};
        const updateDoc = {
            $set: {
                iatDate: sessionUser.iatDate,
                expDate: sessionUser.expDate
            }
        };
        return await this.sessionModel.updateOne(filter, updateDoc);

    }

    async deleteSession(userId: string, deviceId: string) {

        const result = await this.sessionModel.deleteOne({userId, deviceId});

        return result.deletedCount > 0;
    }

    async deleteOtherSessions(userId: string, deviceId: string) {

        const result = await this.sessionModel.deleteMany({userId, deviceId: {$ne: deviceId}});

        return result.deletedCount > 0;
    }
}