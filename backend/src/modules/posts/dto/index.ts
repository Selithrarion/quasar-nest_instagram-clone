import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  description: string;

  @IsString()
  tags: string[];

  @IsBoolean()
  isVideo: boolean;
}

export class UpdatePostDTO extends CreatePostDTO {}
