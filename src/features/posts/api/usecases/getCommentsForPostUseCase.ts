import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../../infrastructure/posts.query-repository";
import {CommentsQueryRepository} from "../../../comments/infrastructure/comments.query-repository";
import {SortPostsDto} from "../models/input/sort-post.input.dto";
import {LikesCommentQueryRepository} from "../../../likeComment/infrastructure/likes-comment.query-repository";
import {
    CommentsForPostOutputModel,
    CommentsForPostOutputModelMapper
} from "../models/output/comments-for-post-output.model";
import {CommentDocument} from "../../../comments/domain/comment.entity";
import {GetAllCommentsForPostOutputType} from "../../../blogs/api/models/types/getAllCommentsForPostOutputType.ts";
import {PostDocument} from "../../domain/posts.entity";
import {LIKE_STATUS} from "../../../../base/enum/enums";


export class GetCommentsForPostUseCaseCommand {
    constructor(
        public postId: string,
        public sortData: SortPostsDto,
        public userId: string) {
    }
}

@CommandHandler(GetCommentsForPostUseCaseCommand)
export class GetCommentsForPostUseCase implements ICommandHandler<GetCommentsForPostUseCaseCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private likesCommentQueryRepository: LikesCommentQueryRepository
    ) {
    }

    async execute(command: GetCommentsForPostUseCaseCommand): Promise<GetAllCommentsForPostOutputType> {

        const sortBy: string = command.sortData.sortBy ?? 'createdAt';
        const sortDirection: "asc" | "desc" = command.sortData.sortDirection ?? 'desc';
        const page: number = command.sortData.pageNumber ?? 1;
        const size: number = command.sortData.pageSize ?? 10;

        const post: PostDocument | null = await this.postsQueryRepository.getPostById(command.postId);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const totalCount: number = await this.commentsQueryRepository.countByPostId(command.postId);
        const pagesCount: number = Math.ceil(totalCount / +size);

        const skip: number = (page - 1) * size;

        const comments: CommentDocument[] = await this.commentsQueryRepository
            .findCommentsByPostIdPaginated(
                command.postId,
                sortBy,
                sortDirection,
                (page - 1) * size,
                size
            );
        let status;

        const mappedComments: CommentsForPostOutputModel[] = await Promise.all(comments.map(async (comment: CommentDocument): Promise<CommentsForPostOutputModel> => {
            const commentId = comment._id.toString()

            let commentLike;

            if (command.userId) {
                commentLike = await this.likesCommentQueryRepository.getLike(commentId, command.userId);
            }

            status = commentLike ? commentLike.status : LIKE_STATUS.NONE;

            return CommentsForPostOutputModelMapper(comment, status);
        }));

        return {
            pagesCount: pagesCount,
            page: +page,
            pageSize: +size,
            totalCount: totalCount,
            items: mappedComments
        }
    }
}