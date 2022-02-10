import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  description: string;

  @IsString()
  tags: string;
}
export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  postID: number;

  @IsNumber()
  replyCommentID?: number;
}

export class UpdatePostDTO extends CreatePostDTO {}
