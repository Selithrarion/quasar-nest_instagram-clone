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
  position: string;

  @IsString()
  department: string;

  @IsString()
  organisation: string;

  @IsString()
  location: string;
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
