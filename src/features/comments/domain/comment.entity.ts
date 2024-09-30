import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {Post} from "../../posts/domain/posts.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
    @Prop({required: true})
    postId: string;

    @Prop({required: true})
    content: string;

    @Prop({
        type: {
            userId: {type: String, required: true},
            userLogin: {type: String, required: true},
        },
    })
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };

    @Prop({default: new Date().toISOString()})
    createdAt: string;

    @Prop({default: 0})
    likesCount: number;

    @Prop({default: 0})
    dislikesCount: number;
}

export const CommentsEntity = SchemaFactory.createForClass(Comment);