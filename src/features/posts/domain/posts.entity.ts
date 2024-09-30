import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, ObjectId} from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    shortDescription: string;

    @Prop({required: true})
    content: string;

    @Prop({required: true})
    blogId: string;

    @Prop({required: true})
    blogName: string;

    @Prop()
    createdAt: Date;

    @Prop({default: 0})
    likesCount: number;

    @Prop({default: 0})
    dislikesCount: number;

    static create(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
    ): Post {
        const post = new Post();
        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.blogId = blogId;
        post.blogName = blogName;
        post.createdAt = new Date();
        return post;
    }
}

export const PostsEntity = SchemaFactory.createForClass(Post);
