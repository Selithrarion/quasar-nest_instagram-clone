import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, RelationId } from 'typeorm';
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
  @RelationId('post')
  postID: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.likedComments, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likes: UserEntity[];
  @RelationId('likes')
  likesUserIDs: number[];

  @OneToOne(() => CommentEntity, (comment) => comment.childComment, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  parentComment: CommentEntity;
  @RelationId('parentComment')
  parentCommentID: number;

  @OneToOne(() => CommentEntity, (comment) => comment.parentComment, {
    nullable: true,
  })
  childComment: CommentEntity;
  @RelationId('childComment')
  childCommentID: number;
}
