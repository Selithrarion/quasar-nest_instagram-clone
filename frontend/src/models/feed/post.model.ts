import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';
import { CommentModel } from 'src/models/feed/comment.model';

export interface PostModel extends BaseModel {
  fileURL: string;
  description: string;
  tags: string[];

  author: UserModel;
  likes?: UserModel[];
  likesNumber: number;

  comments: CommentModel[];
  commentsNumber: number;

  // isAdvertisement: boolean;
  // isAffiliate: boolean;
  // isPaidPartnership: boolean;
  isVideo: boolean;

  isViewerLiked: boolean;
  isViewerSaved: boolean;
  isViewerInPhoto: boolean;
}

export interface PostDTO {
  file: Blob;
  description: string;
  tags: string[];
}

export enum PostReportTypes {
  SPAM = 1,
  NUDITY,
  HATE,
  BULLING,
  AUTHOR_RIGHTS,
  SUICIDE,
  SCAM,
  FALSE_INFORMATION,
  DONT_LIKE,
}
