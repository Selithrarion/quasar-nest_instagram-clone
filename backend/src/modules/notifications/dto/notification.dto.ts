import { IsBoolean } from 'class-validator';

export class UpdateNotificationDTO {
  @IsBoolean()
  read: boolean;
}
