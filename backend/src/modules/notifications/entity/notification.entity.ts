import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from '../../posts/entity/post.entity';

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

  @ManyToOne(() => PostEntity, { nullable: true })
  post: PostEntity;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    cascade: true,
  })
  user: UserEntity;
}
