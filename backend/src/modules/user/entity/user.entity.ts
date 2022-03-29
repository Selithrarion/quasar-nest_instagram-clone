import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  getConnection,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../../common/types/base.entity';
import { PublicFileEntity } from '../../files/entity/public-file.entity';
import { NotificationEntity } from '../../notifications/entity/notification.entity';
import { CommentEntity } from '../../posts/entity/comment.entity';
import { PostEntity } from '../../posts/entity/post.entity';

import stringToHslColor from '../../../common/utils/stringToHslColor';
import { ReportEntity } from '../../posts/entity/report.entity';
import { RecentSearchEntity } from './recentSearch.entity';
import { PostLikeEntity } from '../../posts/entity/postLike.entity';
import { FollowingEntity } from './following.entity';
import { PostFeedEntity } from '../../posts/entity/postFeed.entity';
import { CommentLikeEntity } from '../../posts/entity/commentLike.entity';

export interface UserGoogleData {
  email: string;
  picture: string;
}

export interface UserOTP {
  secret: string;
  otpURL: string;
}

export interface UserValidationDTO {
  readonly email: string;
  readonly password: string;
}
export interface UserTokensInterface {
  readonly user?: UserEntity;
  readonly accessToken: string;
  readonly refreshToken: string;
}
export interface UserUpdateTokensDTO {
  readonly userID: number;
  readonly email: string;
  readonly refreshToken: string;
}
export interface UserJwtPayload {
  readonly id: number;
  readonly email: string;
  readonly is2FAEnabled: boolean;
}

export interface UserSuggestion {
  id: number;
  color: string;
  avatar?: PublicFileEntity | null;
  username: string;
  suggestion: string;
}

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ length: 64 })
  name: string;

  @Column({ length: 24, unique: true })
  @Index()
  username: string;

  @Column({ unique: true })
  @Index()
  @IsEmail()
  email: string;

  @Exclude()
  @Column({ nullable: true, length: 128 })
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }
  async validatePassword(password: string): Promise<boolean> {
    if (this.isOAuthAccount) return true;
    return bcrypt.compare(password, this.password);
  }

  @Exclude()
  @Column({ nullable: true, select: false })
  hashedRefreshToken: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
  @Exclude()
  @Column({ nullable: true, select: false })
  twoFactorSecret: string;

  @Column({ nullable: true })
  locale: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: false })
  isOAuthAccount: boolean;
  @Exclude()
  @Column({ default: false })
  isGoogleAccount: boolean;
  @Exclude()
  @Column({ default: false })
  isGithubAccount: boolean;

  @Column({ default: '#b3e6ff' })
  color: string;
  @BeforeInsert()
  async generateColor(): Promise<void> {
    this.color = stringToHslColor(this.username);
  }

  @OneToOne(() => PublicFileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  avatar: PublicFileEntity;

  @Column({ length: 1024, nullable: true })
  description: string;
  @Column({ length: 512, nullable: true })
  website: string;
  @Column({ length: 64, nullable: true })
  phone: string;
  @Column({ length: 64, nullable: true })
  gender: string;

  @OneToMany(() => PostEntity, (post) => post.author, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];
  postsNumber?: number;

  @OneToMany(() => PostFeedEntity, (pf) => pf.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  postFeed: PostFeedEntity[];

  @OneToMany(() => PostLikeEntity, (pl) => pl.user, {
    cascade: true,
  })
  likedPosts: PostLikeEntity[];

  @OneToMany(() => CommentLikeEntity, (cm) => cm.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likedComments: CommentLikeEntity[];

  @OneToMany(() => FollowingEntity, (f) => f.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  followers: FollowingEntity[];
  followersNumber?: number;

  @OneToMany(() => FollowingEntity, (f) => f.target, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  followedUsers: FollowingEntity[];
  followedNumber?: number;

  @OneToMany(() => CommentEntity, (comment) => comment.author, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => ReportEntity, (r) => r.reporter)
  postReports: ReportEntity[];

  @OneToMany(() => NotificationEntity, (n) => n.receiverUser, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  notifications: NotificationEntity[];

  @OneToMany(() => RecentSearchEntity, (s) => s.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  recentSearch: RecentSearchEntity[];

  isViewerFollowed?: boolean;
  isViewerBlocked?: boolean;

  @AfterLoad()
  async count(): Promise<void> {
    const connection = await getConnection();
    const repository = connection.getRepository('UserEntity');

    const { count: postsNumber } = await repository
      .createQueryBuilder('user')
      .leftJoin('user.posts', 'posts')
      .leftJoin('posts.author', 'author')
      .where('author.id = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne();

    const { count: followersNumber } = await repository
      .createQueryBuilder('followers')
      .where('followers.id = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne();

    const { count: followingNumber } = await repository
      .createQueryBuilder('followedUsers')
      .where('followedUsers.id = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne();

    this.postsNumber = Number(postsNumber);
    this.followersNumber = Number(followersNumber);
    this.followedNumber = Number(followingNumber);
  }
}
