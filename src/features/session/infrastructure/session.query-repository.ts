import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Session, SessionDocument} from "../domain/session.entity";

@Injectable()
export class SessionQueryRepository {
    constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {
    }

}