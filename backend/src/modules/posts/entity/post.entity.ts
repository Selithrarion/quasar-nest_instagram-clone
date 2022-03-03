import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { CommentEntity } from './comment.entity';
import { PublicFileEntity } from '../../files/entity/public-file.entity';
import { ReportEntity } from './report.entity';
import { TagEntity } from './tag.entity';
import { PostLikeEntity } from './postLike.entity';
import { PostFeedEntity } from './postFeed.entity';

@Entity()
export class PostEntity extends BaseEntity {
  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => TagEntity, (t) => t.posts, { cascade: true, nullable: true })
  @JoinTable()
  tags: TagEntity[] | string[];
  @AfterLoad()
  flatTags(): void {
    this.tags = this.tags?.map((t) => t.name) || [];
  }

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'authorID' })
  author: UserEntity;

  @OneToMany(() => PostLikeEntity, (pl) => pl.post, {
    cascade: true,
  })
  likes: PostLikeEntity[];
  likesNumber?: number;

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments: CommentEntity[];
  @RelationId('comments')
  commentIDs: number;

  @OneToMany(() => ReportEntity, (report) => report.reported)
  reports: ReportEntity[];

  @Column({ type: 'boolean', default: false })
  isVideo: boolean;

  @OneToOne(() => PublicFileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  file: PublicFileEntity;
  fileURL: string;
  @AfterLoad()
  getFileURL(): void {
    this.fileURL = this.file?.url;
  }

  @OneToMany(() => PostFeedEntity, (pf) => pf.post, {
    cascade: true,
  })
  feeds: PostFeedEntity[];

  isViewerLiked: boolean;
  isViewerSaved: boolean;
  isViewerInPhoto: boolean;
}
