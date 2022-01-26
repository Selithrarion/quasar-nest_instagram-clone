import { Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class FollowingEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.followers)
  followedTo: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followedUsers)
  @Index()
  follower: UserEntity;
}
