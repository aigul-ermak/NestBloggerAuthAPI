import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    deviceId: string;

    @Prop({required: true})
    ip: string;

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    iatDate: Date;

    @Prop({required: true})
    expDate: Date;
}

export const SessionEntity = SchemaFactory.createForClass(Session);