import {Injectable, Session} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SessionDocument} from "../domain/session.entity";

@Injectable()
export class SessionRepository {
    constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {
    }


}