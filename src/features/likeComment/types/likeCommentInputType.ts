import {LIKE_STATUS} from "../../../base/enum/enums";

export type LikeCommentInputType = {
    status: LIKE_STATUS,
    userId: string,
    commentId: string,
    login: string,
    createdAt: Date,
}