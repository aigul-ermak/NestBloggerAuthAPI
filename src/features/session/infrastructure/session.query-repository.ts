import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Session, SessionDocument} from "../domain/session.entity";

@Injectable()
export class SessionQueryRepository {
    constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {
    }

    async getUserSession(userId: string, deviceId: string) {

        return this.sessionModel.findOne({userId, deviceId}).exec();

    }

    async getUserSessionByDeviceId(deviceId: string) {

        return this.sessionModel.findOne({deviceId}).exec();

    }

    async getUserDevicesActiveSessions(userId: string) {

        return this.sessionModel.find({userId}).exec();

    }

    async getAllSession() {

        return this.sessionModel.find({}).exec();

    }
}