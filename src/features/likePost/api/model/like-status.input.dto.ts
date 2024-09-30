import {IsEnum} from "class-validator";
import {LIKE_STATUS} from "../../domain/like.entity";

export class LikeStatusInputDto {
    @IsEnum(LIKE_STATUS, {message: 'Status must be one of Like, Dislike, or None'})
    likeStatus: LIKE_STATUS;
}
