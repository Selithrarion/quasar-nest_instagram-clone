import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';
import { CommentLikeEntity } from './commentLike.entity';

// TODO: make comment replies with path enumeration
// @Tree('materialized-path')
//
// @TreeParent()
// parentComment: CommentEntity;
// @TreeChildren()
// replies: CommentEntity[];
// problem - can't get comments tree only for needed post.
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
  @RelationId('post')
  postID: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @OneToMany(() => CommentLikeEntity, (cm) => cm.comment, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likes: CommentLikeEntity[];

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentCommentID' })
  @Index()
  parentComment: CommentEntity;
  @RelationId('parentComment')
  parentCommentID: number;

  @OneToMany(() => CommentEntity, (comment) => comment.parentComment, {
    nullable: true,
  })
  replies: CommentEntity;
  @RelationId('replies')
  repliesIDs: number;
}
