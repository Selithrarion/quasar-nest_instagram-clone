import { IsNumber, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  description: string;
}
export class CreateCommentDTO {
  @IsString()
  text: string;

  @IsNumber()
  postID: number;
}

export class UpdatePostDTO extends CreatePostDTO {}
