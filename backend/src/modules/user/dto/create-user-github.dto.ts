import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserGithubDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsNotEmpty()
  @MaxLength(24)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  location: string;

  @IsString()
  company: string;
}
