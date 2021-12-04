import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';

@Entity()
export class CommentEntity extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postID' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.likedComments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issueID' })
  likes: UserEntity[];

  @RelationId('likes')
  likesNumber: number;
}
