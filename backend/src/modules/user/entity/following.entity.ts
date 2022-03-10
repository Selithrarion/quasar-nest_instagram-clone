import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class FollowingEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (u) => u.followers, {
    cascade: true,
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.followedUsers, {
    cascade: true,
  })
  target: UserEntity;
}
