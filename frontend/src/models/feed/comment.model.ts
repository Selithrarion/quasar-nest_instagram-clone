import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';

export interface CommentModel extends BaseModel {
  text: string;
  postID: number;
  author: UserModel;

  likes: UserModel[];

  parentComment?: CommentModel;
  parentCommentID: number;

  isViewerLiked: boolean;
}

export interface CommentDTO {
  text: string;
  postID: number;
  replyCommentID?: number;
}
