import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  image: string;

  @IsString()
  description: string;
}

export class UpdatePostDTO extends CreatePostDTO {}
