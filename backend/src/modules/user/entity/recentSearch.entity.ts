import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class RecentSearchEntity extends BaseEntity {
  @Column()
  itemID: number;

  @Column()
  type: 'user' | 'tag';

  @ManyToOne(() => UserEntity, (u) => u.recentSearch, {
    cascade: true,
  })
  user: UserEntity;
}
