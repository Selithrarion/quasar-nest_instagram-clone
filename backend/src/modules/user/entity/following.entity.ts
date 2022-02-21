import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class FollowingEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (u) => u.followers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (u) => u.followedUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  target: UserEntity;

  // @Column()
  // userID: number;
  //
  // @Column()
  // targetID: number;
}
