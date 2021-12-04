import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { CommentEntity } from './comment.entity';

@Entity()
export class PostEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  tags: string[];

  @ManyToOne(() => UserEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.likedPosts, {
    cascade: true,
  })
  @JoinTable()
  likes: UserEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments: CommentEntity[];

  @Column({ type: 'boolean', default: false })
  isVideo: boolean;
}
