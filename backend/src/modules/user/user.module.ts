import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { FollowingEntity } from './entity/following.entity';

import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowingEntity]), FilesModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
