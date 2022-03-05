import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';

@Entity()
export class PostLikeEntity extends BaseEntity {
  @ManyToOne(() => PostEntity, (p) => p.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postID' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (u) => u.likedPosts, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userID' })
  user: UserEntity;
}
