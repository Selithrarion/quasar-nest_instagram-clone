import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDTO {
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

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDTO {
  @IsString()
  @MaxLength(64)
  username?: string;
  @IsString()
  @MaxLength(24)
  name?: string;
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @MaxLength(1024)
  description?: string;
  @IsString()
  @MaxLength(512)
  website?: string;
  @IsString()
  @MaxLength(64)
  phone?: string;
  @IsString()
  @MaxLength(64)
  gender?: string;
}

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
