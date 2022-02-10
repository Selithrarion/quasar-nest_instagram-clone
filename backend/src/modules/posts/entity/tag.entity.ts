import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { PostEntity } from './post.entity';

@Entity()
export class TagEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => PostEntity, (p) => p.tags, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  post: PostEntity;
}
