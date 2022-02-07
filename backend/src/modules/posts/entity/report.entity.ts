import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from './post.entity';

export enum PostReportTypes {
  SPAM = 1,
  NUDITY,
  HATE,
  BULLING,
  AUTHOR_RIGHTS,
  SUICIDE,
  SCAM,
  FALSE_INFORMATION,
  DONT_LIKE,
}

@Entity()
export class ReportEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.postReports)
  @JoinColumn({ name: 'reporterID' })
  reporter: UserEntity;

  @OneToOne(() => PostEntity, (post) => post.reports)
  @JoinColumn({ name: 'reportedID' })
  reported: PostEntity;

  @Column({ type: 'enum', enum: PostReportTypes })
  reasonID: PostReportTypes;
}
