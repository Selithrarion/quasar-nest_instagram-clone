import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

import { PostEntity } from './entity/post.entity';
import { CommentEntity } from './entity/comment.entity';
import { CommentLikeEntity } from './entity/commentLike.entity';
import { ReportEntity } from './entity/report.entity';
import { TagEntity } from './entity/tag.entity';
import { PostLikeEntity } from './entity/postLike.entity';
import { PostFeedEntity } from './entity/postFeed.entity';

import { FilesModule } from '../files/files.module';
import { UserModule } from '../user/user.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CommentEntity,
      CommentLikeEntity,
      ReportEntity,
      TagEntity,
      PostLikeEntity,
      PostFeedEntity,
    ]),
    FilesModule,
    NotificationsModule,
    forwardRef(() => UserModule),
  ],
  exports: [PostsService],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
