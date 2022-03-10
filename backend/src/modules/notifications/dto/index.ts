import { IsBoolean } from 'class-validator';
import { NotificationTypes } from '../entity/notification.entity';

export class CreateNotificationDTO {
  type: NotificationTypes;
  receiverUserID: number;
  initiatorUserID: number;
  postID?: number;
  commentID?: number;
}
export class UpdateNotificationDTO {
  @IsBoolean()
  read: boolean;
}
