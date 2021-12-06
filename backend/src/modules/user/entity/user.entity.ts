import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
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
  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
  @Exclude()
  @Column({ nullable: true })
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

  @Column({ nullable: true })
  position: string;
  @Column({ nullable: true })
  department: string;
  @Column({ nullable: true })
  organisation: string;
  @Column({ nullable: true })
  location: string;

  @ManyToMany(() => PostEntity, (post) => post.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likedPosts: PostEntity[];
  @RelationId('likedPosts')
  likedPostsIDs: number[];

  @ManyToMany(() => CommentEntity, (comment) => comment.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likedComments: CommentEntity[];
  @RelationId('likedComments')
  likedCommentsIDs: number[];

  @OneToMany(() => CommentEntity, (comment) => comment.author, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  notifications: NotificationEntity[];
}
