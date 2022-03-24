import {
  AfterLoad,
  Column,
  Entity,
  getConnection,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
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
  commentsNumber: number;

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

  @AfterLoad()
  async count(): Promise<void> {
    const connection = await getConnection();
    const postRepository = connection.getRepository('PostEntity');

    const { commentsNumber } = await postRepository
      .createQueryBuilder('post')
      .leftJoin('post.comments', 'comments')
      .where('post.id = :id', { id: this.id })
      .select('COUNT(comments)', 'commentsNumber')
      .getRawOne();
    const { likesNumber } = await postRepository
      .createQueryBuilder('post')
      .leftJoin('post.likes', 'likes')
      .where('post.id = :id', { id: this.id })
      .select('COUNT(likes)', 'likesNumber')
      .getRawOne();

    // TODO: incorrect behavior sometimes when there are some comments and likes
    // const { likesNumber, commentsNumber } = await postRepository
    //   .createQueryBuilder('post')
    //   .where('post.id = :id', { id: this.id })
    //   .leftJoin('post.likes', 'likes')
    //   .leftJoin('post.comments', 'comments')
    //   .select('COUNT(likes)', 'likesNumber')
    //   .addSelect('COUNT(comments)', 'commentsNumber')
    //   .getRawOne();

    this.commentsNumber = Number(commentsNumber);
    this.likesNumber = Number(likesNumber);
  }
}
