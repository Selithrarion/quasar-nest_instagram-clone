import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';
import { CommentModel } from 'src/models/feed/comment.model';

export interface StoryModel extends BaseModel {
  fileURL: string;
  description: string;

  author: UserModel;

  comments: CommentModel;
  commentsNumber: number;

  isVideo: boolean;
}

export interface StoryDTO {
  file: Blob;
}
