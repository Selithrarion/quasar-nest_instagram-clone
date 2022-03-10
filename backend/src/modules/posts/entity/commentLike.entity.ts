import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class CommentLikeEntity extends BaseEntity {
  @ManyToOne(() => CommentEntity, (c) => c.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comment: CommentEntity;

  @ManyToOne(() => UserEntity, (u) => u.likedComments, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
