import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

import { PostEntity } from './entity/post.entity';
import { CommentEntity } from './entity/comment.entity';
import { ReportEntity } from './entity/report.entity';
import { TagEntity } from './entity/tag.entity';

import { FilesModule } from '../files/files.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CommentEntity, ReportEntity, TagEntity]),
    FilesModule,
    forwardRef(() => UserModule),
  ],
  exports: [PostsService],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
