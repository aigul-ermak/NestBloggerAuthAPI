import {SessionDocument} from "../../../domain/session.entity";

export class SessionOutputModel {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string
}


export const SessionsOutputModelMapper = (session: SessionDocument): SessionOutputModel => {
    const outputModel = new SessionOutputModel();

    outputModel.ip = session.ip;
    outputModel.title = session.title;
    outputModel.lastActiveDate = session.iatDate.toISOString();
    outputModel.deviceId = session.deviceId;

    return outputModel;
}

