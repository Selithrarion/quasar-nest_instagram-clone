import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  description: string;
}

export class UpdatePostDTO extends CreatePostDTO {}
