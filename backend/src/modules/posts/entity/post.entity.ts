import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { CommentEntity } from './comment.entity';
import { Exclude } from 'class-transformer';
import { PublicFileEntity } from '../../files/entity/public-file.entity';

@Entity()
export class PostEntity extends BaseEntity {
  @Column({ nullable: true })
  description: string;

  @Exclude()
  @Column('text', { array: true, nullable: true })
  tags: string[];

  @ManyToOne(() => UserEntity, (user) => user.posts, {
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
  @RelationId('likes')
  likesUserIDs: number[];

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments: CommentEntity[];
  @RelationId('comments')
  commentIDs: number;

  @Column({ type: 'boolean', default: false })
  isVideo: boolean;

  @OneToOne(() => PublicFileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  file: PublicFileEntity;
  fileURL: string;
}
