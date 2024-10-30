import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {UsersQueryRepository} from "../../../users/infrastructure/users.query-repository";
import {CommentInputDto} from "../../../comments/api/model/input/comment-input.dto";
import {CommentsRepository} from "../../../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../../../comments/infrastructure/comments.query-repository";
import {CommentOutputModel, CommentOutputModelMapper} from "../../../comments/api/model/output/comment-output.model";
import {PostDocument} from "../../domain/posts.entity";
import {UserOutputModel} from "../../../users/api/models/output/user.output.model";
import {CommentDocument} from "../../../comments/domain/comment.entity";


export class CreateCommentForPostUseCaseCommand {
    constructor(public postId: string,
                public userId: string,
                public comment: CommentInputDto) {
    }
}

@CommandHandler(CreateCommentForPostUseCaseCommand)
export class CreateCommentForPostUseCase implements ICommandHandler<CreateCommentForPostUseCaseCommand> {

    constructor(
        private commentRepository: CommentsRepository,
        private commentQueryRepository: CommentsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(command: CreateCommentForPostUseCaseCommand): Promise<CommentOutputModel> {

        const post: PostDocument | null = await this.postsQueryRepository.getPostById(command.postId);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const user: UserOutputModel | null = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

        const newComment: {
            createdAt: number;
            likesCount: number;
            commentatorInfo: { userLogin: string; userId: string };
            dislikesCount: number;
            postId: string;
            content: string
        } = {
            postId: command.postId,
            content: command.comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: Date.now(),
            likesCount: 0,
            dislikesCount: 0
        }

        const commentId: string = await this.commentRepository.createComment(newComment);

        const comment: CommentDocument | null = await this.commentQueryRepository.getCommentById(commentId);
        if (!comment) {
            throw new InternalServerErrorException(`Failed to retrieve the created comment`);
        }

        return CommentOutputModelMapper(comment);
    }
}
