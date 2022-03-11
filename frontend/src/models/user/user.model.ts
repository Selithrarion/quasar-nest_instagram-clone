import { BaseModel } from 'src/models/common/base.model';
import { PublicFileModel } from 'src/models/common/public-file.model';
import { PostModel } from 'src/models/feed/post.model';

export interface UserModel extends BaseModel {
  name: string;
  username: string;
  password: string;
  email: string;

  description: string;
  website: string;
  gender: string;
  phone: string;

  isActive: boolean;
  isEmailConfirmed: boolean;
  isOAuthAccount: boolean;
  isTwoFactorEnabled: boolean;

  color: string;
  avatar: PublicFileModel | null;

  posts?: PostModel[];
  postsNumber?: number;

  isViewerFollowed?: boolean;
  isViewerBlocked?: boolean;

  followersNumber?: number;
  followedNumber?: number;

  accessToken?: string;
  refreshToken?: string;
}

export interface UserDTO {
  username?: string;
  name?: string;
  email?: string;
  avatar?: PublicFileModel;

  description?: string;
  website?: string;
  phone?: string;
  gender?: string;
}

export interface UserSuggestionModel {
  id: number;
  color: string;
  avatar?: PublicFileModel | null;
  username: string;
  suggestion: string;
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
export interface UserUpdateTokenResponse extends UserAuthResponse {}
export interface UserUpdateTokenDTO {
  userID: number;
  refreshToken: string;
}
