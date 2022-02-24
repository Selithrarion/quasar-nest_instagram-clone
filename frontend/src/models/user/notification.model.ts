import { BaseModel } from 'src/models/common/base.model';
import { UserModel } from 'src/models/user/user.model';

export enum NotificationTypes {
  LIKED_PHOTO = 'likedPhoto',
  LIKED_VIDEO = 'likedVideo',
  LIKED_COMMENT = 'likedComment',
  FOLLOWED = 'followed',
}

export interface NotificationModel extends BaseModel {
  type: NotificationTypes;
  user: UserModel;
  read: boolean;
}
