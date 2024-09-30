import {NotFoundException} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {PostsQueryRepository} from "../posts/infrastructure/posts.query-repository";
import {CommentsQueryRepository} from "../comments/infrastructure/comments.query-repository";
import {SortPostsDto} from "../posts/api/models/input/sort-post.input.dto";
import {CommentOutputModelMapper} from "../comments/api/model/output/comment-output.model";
import {PostsOutputModelMapper} from "../posts/api/models/output/post-db.output.model";
import {LikesCommentQueryRepository} from "../likeComment/infrastructure/likes-comment.query-repository";
import {PostCommentOutputModelMapper} from "../posts/api/models/output/post-comment.output.model";


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

    async execute(command: GetCommentsForPostUseCaseCommand) {

        const sortBy = command.sortData.sortBy ?? 'createdAt';
        const sortDirection = command.sortData.sortDirection ?? 'desc';
        const page = command.sortData.pageNumber ?? 1;
        const size = command.sortData.pageSize ?? 10;

        const post = await this.postsQueryRepository.getPostById(command.postId);

        if (!post) {
            throw new NotFoundException(`Post not found`);
        }

        const totalCount = await this.commentsQueryRepository.countByPostId(command.postId);
        const pagesCount = Math.ceil(totalCount / +size);

        const skip = (page - 1) * size;

        const comments = await this.commentsQueryRepository
            .findCommentssByPostIdPaginated(
                command.postId,
                sortBy,
                sortDirection,
                (page - 1) * size,
                size
            );
        let status;


        const mappedComments = await Promise.all(comments.map(async (comment) => {
            const commentId = comment._id.toString()
            console.log(comment)
            let commentLike;

            if (command.userId) {
                commentLike = await this.likesCommentQueryRepository.getLike(commentId, command.userId);
            }

            status = commentLike ? commentLike.status : 'None';

            return PostCommentOutputModelMapper(comment, status);
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