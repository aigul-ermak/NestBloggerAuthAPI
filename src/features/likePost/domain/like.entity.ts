import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

export enum LIKE_STATUS {
    LIKE = 'Like',
    DISLIKE = 'Dislike',
    NONE = 'None'
}

@Schema()
export class Like {
    @Prop({required: true, enum: LIKE_STATUS})
    status: LIKE_STATUS;

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    parentId: string;

    @Prop({required: true})
    login: string;

    @Prop({required: true})
    createdAt: Date;

    // static create(userId: string, parentId: string, login: string, status: LIKE_STATUS): Like {
    //     const likePost = new Like();
    //     likePost.userId = userId;
    //     likePost.parentId = parentId;
    //     likePost.login = login;
    //     likePost.status = status;
    //     likePost.createdAt = new Date();
    //     return likePost;
    // }
}

export const LikesEntity = SchemaFactory.createForClass(Like);
