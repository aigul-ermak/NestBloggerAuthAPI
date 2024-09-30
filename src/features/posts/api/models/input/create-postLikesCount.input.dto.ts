import {IsInt, Min} from 'class-validator';

export class UpdatePostLikesCountDto {
    @IsInt()
    @Min(0, {message: 'Likes count cannot be negative'})
    likesCount: number;

    @IsInt()
    @Min(0, {message: 'Dislikes count cannot be negative'})
    dislikesCount: number;
}