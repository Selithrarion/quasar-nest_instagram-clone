import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from './entity/post.entity';

import { FilesModule } from "../files/files.module";
import { UserModule } from '../user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), FilesModule, UserModule],
  exports: [PostsService],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
