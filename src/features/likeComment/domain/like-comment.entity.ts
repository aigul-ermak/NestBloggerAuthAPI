import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {LIKE_STATUS} from "../../../base/enum/enums";

export type LikeCommentDocument = HydratedDocument<LikeComment>;

@Schema()
export class LikeComment {
    @Prop({required: true, type: String, enum: LIKE_STATUS, default: LIKE_STATUS.NONE})
    status: LIKE_STATUS;

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    commentId: string;

    @Prop({required: true})
    login: string;

    @Prop({required: true})
    createdAt: Date;
}

export const LikesCommentEntity = SchemaFactory.createForClass(LikeComment);
