import { IsString } from 'class-validator';

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
