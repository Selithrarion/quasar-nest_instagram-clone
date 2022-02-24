import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';

export enum NotificationTypes {
  LIKED_PHOTO = 'likedPhoto',
  LIKED_VIDEO = 'likedVideo',
  LIKED_COMMENT = 'likedComment',
  FOLLOWED = 'followed',
}

@Entity()
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'enum', enum: NotificationTypes })
  type: NotificationTypes;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    cascade: true,
    eager: true
  })
  user: UserEntity;
}
