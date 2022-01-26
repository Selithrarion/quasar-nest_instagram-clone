import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto';
import { UserEntity } from './entity/user.entity';
import { PostEntity } from '../posts/entity/post.entity';

import { FilesService } from '../files/files.service';
import { PublicFileEntity } from '../files/entity/public-file.entity';
import { CreateUserGithubDTO } from './dto';
import { NotificationEntity } from '../notifications/entity/notification.entity';
import { FollowingEntity } from './entity/following.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(FollowingEntity)
    private readonly followings: Repository<FollowingEntity>,

    @Inject(FilesService)
    private readonly filesService: FilesService
  ) {}

  async getAll(search: string, currentUserID: number): Promise<UserEntity[]> {
    if (!search.length)
      return this.users.find({
        where: {
          id: Not(currentUserID),
        },
        take: 10,
      });

    const searchResult = await this.users
      .createQueryBuilder()
      .select()
      .where('username ILIKE :search', { search: `%${search}%` })
      .orWhere('name ILIKE :search', { search: `%${search}%` })
      .orWhere('email ILIKE :search', { search: `%${search}%` })
      .getMany();
    const currentUserIndexInSearchResult = searchResult.findIndex((u) => u.id === currentUserID);
    if (currentUserIndexInSearchResult !== -1) searchResult.splice(currentUserIndexInSearchResult, 1);

    return searchResult;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return await this.users.findOne({ where: { email } });
  }
  async getByID(id: number): Promise<UserEntity> {
    return await this.users.findOne(id);
  }
  async getProfileByID(id: number): Promise<UserEntity> {
    return await this.users.findOneOrFail(id);
  }

  async create(payload: CreateUserDTO): Promise<UserEntity> {
    const isUserAlreadyExist = await this.users.findOne({ where: { email: payload.email } });
    if (isUserAlreadyExist) throw new HttpException('USER_ALREADY_EXIST', HttpStatus.BAD_REQUEST);

    const user = await this.users.create(payload);
    return await this.users.save(user);
  }
  async createWithGoogle(email: string): Promise<UserEntity> {
    // TODO: need to get google username and name
    const emailFirstPart = email.split('@')[0];
    const user = await this.users.create({
      email,
      name: emailFirstPart,
      username: emailFirstPart,
      isOAuthAccount: true,
      isGoogleAccount: true,
      isEmailConfirmed: true,
    });
    return this.users.save(user);
  }
  async createWithGithub(payload: CreateUserGithubDTO): Promise<UserEntity> {
    const user = await this.users.create({
      ...payload,
      isOAuthAccount: true,
      isGithubAccount: true,
      isEmailConfirmed: true,
    });
    return this.users.save(user);
  }

  async update(id: number, payload: Partial<UserEntity>): Promise<UserEntity> {
    const toUpdate = await this.users.findOneOrFail(id);
    const user = this.users.create({ ...toUpdate, ...payload });
    return await this.users.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.users.delete(id);
  }

  async setUserImage(file: Express.Multer.File, field: 'avatar', id: number): Promise<PublicFileEntity> {
    const user = await this.users.findOneOrFail(id);
    const isAlreadyHaveFieldImage = Boolean(user[field]);

    if (isAlreadyHaveFieldImage) {
      const updatedUser = await this.users.save({
        ...user,
        [field]: null,
      });
      await this.filesService.deletePublicFile(user[field].id);
    }
    const uploadedFile = await this.filesService.uploadPublicFile({
      file,
      quality: field === 'avatar' ? 5 : 20,
      imageMaxSizeMB: 20,
      type: 'image',
    });
    const updatedUser = await this.users.save({
      ...user,
      [field]: uploadedFile,
    });

    return uploadedFile;
  }

  async deleteUserImage(field: 'avatar', id: number): Promise<void> {
    const user = await this.users.findOneOrFail(id);
    const fileID = user[field]?.id;
    if (fileID) {
      const updatedUser = await this.users.save({
        ...user,
        [field]: null,
      });
      await this.filesService.deletePublicFile(fileID);
    }
  }

  async setRefreshToken(id: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.users.update(id, {
      hashedRefreshToken,
    });
  }

  async enable2FA(id: number): Promise<boolean> {
    await this.users.update(id, {
      isTwoFactorEnabled: true,
    });
    return true;
  }
  async set2FaSecret(id: number, secret: string): Promise<boolean> {
    await this.users.update(id, {
      twoFactorSecret: secret,
    });
    return true;
  }

  async getLikedPosts(id: number): Promise<PostEntity[]> {
    const user = await this.users.findOneOrFail(id, { relations: ['likedPosts'] });
    return user.likedPosts;
  }
  async getNotifications(id: number): Promise<NotificationEntity[]> {
    const user = await this.users
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.notifications', 'notifications')
      .orderBy('notifications.createdAt', 'DESC')
      .getOneOrFail();
    return user.notifications;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { username } });
    return Boolean(user);
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { email } });
    return Boolean(user);
  }

  async confirmUserEmail(email: string): Promise<boolean> {
    await this.users.update(
      { email },
      {
        isEmailConfirmed: true,
      }
    );
    return true;
  }

  async follow(id: number, currentUserID: number): Promise<void> {
    const user = await this.users.findOneOrFail(id, { relations: ['followers'] });
    const currentUser = await this.users.findOneOrFail(currentUserID);
    await this.users.save({ ...user, followers: [...user.followers, currentUser] });

    // const user = await this.users.findOneOrFail(id);
    // const currentUser = await this.users.findOneOrFail(currentUserID);
    // // await this.users.save({ ...user, followers: [...user.followers, currentUser] });
    // // await this.users.save({ ...currentUser, followedUsers: [...user.followedUsers, user] });
    // console.log(user, currentUser);
    // const following = await this.followings.save({ follower: currentUser, followedTo: user });
    // console.log('following', following);
  }
  async unfollow(id: number, currentUserID: number): Promise<void> {
    const user = await this.users.findOneOrFail(id, { relations: ['followers'] });
    await this.users.save({ ...user, followers: user.followers.filter((f) => f.id !== currentUserID) });

    // // const user = await this.users.findOneOrFail(id, { relations: ['followers'] });
    // // const currentUser = await this.users.findOneOrFail(currentUserID, { relations: ['followedUsers'] });
    // // await this.users.save({ ...user, followers: user.followers.filter((f) => f.id !== currentUserID) });
    // // await this.users.save({ ...currentUser, followedUsers: user.followedUsers.filter((f) => f.id !== id) });
    // // const user = await this.users.findOneOrFail(id);
    // const currentUser = await this.users.findOneOrFail(currentUserID);
    // const following = await this.followings.findOneOrFail({ where: { follower: currentUser } });
    // console.log('unfollow', following);
    // await this.followings.remove(following);
  }
}
