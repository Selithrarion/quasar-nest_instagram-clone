import { Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';

@Entity()
export class PostFeedEntity extends BaseEntity {
  @Index()
  @ManyToOne(() => UserEntity, (u) => u.postFeed, {
    cascade: true,
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (p) => p.feeds, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  post: PostEntity;
}
