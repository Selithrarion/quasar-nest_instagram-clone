import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from '../../posts/entity/post.entity';
import { CommentEntity } from '../../posts/entity/comment.entity';

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

  @ManyToOne(() => PostEntity, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  post: PostEntity;
  @ManyToOne(() => CommentEntity, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    cascade: true,
  })
  receiverUser: UserEntity;
  @ManyToOne(() => UserEntity, {
    cascade: true,
  })
  initiatorUser: UserEntity;
}
