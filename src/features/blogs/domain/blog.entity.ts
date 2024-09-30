import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, ObjectId} from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
    @Prop()
    login: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    websiteUrl: string;

    @Prop()
    createdAt: Date;

    @Prop()
    isMembership: boolean;

    static create(name: string, description: string, websiteUrl: string): Blog {
        const blog = new Blog();
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        blog.createdAt = new Date();
        blog.isMembership = false;
        return blog;
    }
}

export const BlogEntity = SchemaFactory.createForClass(Blog);
