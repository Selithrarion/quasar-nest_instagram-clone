import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { FollowingEntity } from './entity/following.entity';
import { RecentSearchEntity } from './entity/recentSearch.entity';

import { FilesModule } from '../files/files.module';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowingEntity, RecentSearchEntity]),
    FilesModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => PostsModule),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
