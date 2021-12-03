import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';
import { CommentModel } from 'src/models/post/comment.model';

export interface PostModel extends BaseModel {
  title: string;
  description: string;
  tags: string[];

  author: UserModel;
  likes: UserModel[];

  comments: CommentModel;
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
  title: string;
  description: string;
  tags: string[];
}
