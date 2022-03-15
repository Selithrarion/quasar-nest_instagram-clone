import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';
import { CommentLikeEntity } from './commentLike.entity';

@Entity()
@Tree('materialized-path')
export class CommentEntity extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postID' })
  post: PostEntity;
  @RelationId('post')
  postID: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    eager: true,
    // TODO: we don't need comment and it's replies delete when author delete. need to make it like Habr
    // check that there is no constraints error
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @OneToMany(() => CommentLikeEntity, (cm) => cm.comment, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likes: CommentLikeEntity[];

  @TreeParent()
  parentComment: CommentEntity;
  @TreeChildren()
  replies: CommentEntity[];
}
