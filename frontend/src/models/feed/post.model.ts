import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';
import { CommentModel } from 'src/models/feed/comment.model';

export interface PostModel extends BaseModel {
  fileURL: string;
  description: string;

  author: UserModel;
  likes?: UserModel[];
  likesUserIDs: number[];

  comments: CommentModel;
  commentsNumber: number;

  // isAdvertisement: boolean;
  // isAffiliate: boolean;
  // isPaidPartnership: boolean;
  isVideo: boolean;

  isViewerFollowed: boolean;
  isViewerLiked: boolean;
  isViewerSaved: boolean;
  isViewerInPhoto: boolean;
}

export interface PostDTO {
  file: Blob;
  description: string;
}
