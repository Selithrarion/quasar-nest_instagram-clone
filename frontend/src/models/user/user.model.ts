import { BaseModel } from 'src/models/common/base.model';
import { PublicFileModel } from 'src/models/common/public.file.model';
import { PostModel } from 'src/models/post/post.model';

export interface UserModel extends BaseModel {
  name: string;
  username: string;
  password: string;
  email: string;
  locale: string;
  phone?: string;

  isActive: boolean;
  isEmailConfirmed: boolean;
  isOAuthAccount: boolean;
  isTwoFactorEnabled: boolean;

  color: string;
  avatar: PublicFileModel | null;

  posts?: PostModel[];

  isViewerFollowed?: boolean;
  isViewerBlocked?: boolean;

  accessToken?: string;
  refreshToken?: string;
}

export interface UserDTO {
  username?: string;
  name?: string;
  avatar?: PublicFileModel;
  location?: string;
  phone?: string;
}

export interface UserSuggestionModel {
  id: number;
  color: string;
  avatar?: PublicFileModel | null;
  username: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}
export interface UserRegisterDTO {
  name: string;
  username: string;
  password: string;
  email: string;
}
export interface UserAuthResponse {
  user: UserModel;
  accessToken: string;
  refreshToken: string;
}
export interface UserUpdateTokenResponse {
  accessToken: string;
  refreshToken: string;
}
export interface UserUpdateTokenDTO {
  userID: number;
  refreshToken: string;
}
