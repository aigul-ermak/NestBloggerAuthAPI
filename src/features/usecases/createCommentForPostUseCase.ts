import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import {CommentInputDto} from "../comments/api/model/input/comment-input.dto";
import {CommentsRepository} from "../comments/infrastructure/comments.repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {CommentOutputModelMapper} from "../comments/api/model/output/comment-output.model";


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

    async execute(command: CreateCommentForPostUseCaseCommand) {

        const post = await this.postsQueryRepository.getPostById(command.postId);
        let like;

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const user = await this.usersQueryRepository.getUserById(command.userId);

        if (!user) {
            throw new BadRequestException();
        }

// TODO type?
        const newComment = {
            postId: command.postId,
            content: command.comment.content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }

        const commentId = await this.commentRepository.createComment(newComment);

        const comment = await this.commentQueryRepository.getCommentById(commentId);

        return CommentOutputModelMapper(comment);
    }
}
