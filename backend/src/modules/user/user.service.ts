import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';

import { CreateUserDTO } from './dto';
import { UserEntity, UserSuggestion } from './entity/user.entity';

import { FilesService } from '../files/files.service';
import { PublicFileEntity } from '../files/entity/public-file.entity';
import { CreateUserGithubDTO } from './dto';
import { NotificationEntity, NotificationTypes } from '../notifications/entity/notification.entity';
import { FollowingEntity } from './entity/following.entity';
import { CommentEntity } from '../posts/entity/comment.entity';
import { PostsService } from '../posts/posts.service';
import { RecentSearchEntity } from './entity/recentSearch.entity';
import { TagEntity } from '../posts/entity/tag.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(FollowingEntity)
    private readonly userFollowings: Repository<FollowingEntity>,
    @InjectRepository(RecentSearchEntity)
    private readonly recentSearch: Repository<RecentSearchEntity>,

    @Inject(FilesService)
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService
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
  async getByID(id: number, options: FindOneOptions<UserEntity> = {}): Promise<UserEntity> {
    return await this.users.findOne(id, options);
  }
  async getProfileByUsername(username: string, currentUserID: number): Promise<UserEntity> {
    const user = await this.users
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('user.posts', 'posts')
      .leftJoinAndSelect('posts.file', 'file')
      .leftJoinAndSelect('posts.tags', 'tags')
      .leftJoinAndSelect('posts.likes', 'likes')
      .orderBy('posts.createdAt', 'DESC')
      .getOneOrFail();

    const formattedPosts = await Promise.all(
      user.posts.map(async (p) => {
        return {
          ...p,
          isViewerLiked: await this.postsService.getIsUserLikedPost(user, p),
        };
      })
    );
    return {
      ...user,
      isViewerFollowed: await this.getIsUserFollowed(user.id, currentUserID),
      isViewerBlocked: false,
      posts: formattedPosts,
    } as unknown as UserEntity;
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
      await this.users.save({
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
    await this.users.save({
      ...user,
      [field]: uploadedFile,
    });

    return uploadedFile;
  }

  async deleteUserImage(field: 'avatar', id: number): Promise<void> {
    const user = await this.users.findOneOrFail(id);
    const fileID = user[field]?.id;
    if (fileID) {
      await this.users.save({
        ...user,
        [field]: null,
      });
      await this.filesService.deletePublicFile(fileID);
    }
  }

  async setHashedRefreshToken(id: number, hashedRefreshToken: string): Promise<void> {
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

  async getNotifications(id: number): Promise<NotificationEntity[]> {
    const { notifications } = await this.users
      .createQueryBuilder('user')
      .where('user.id = :id', { id })

      .leftJoinAndSelect('user.notifications', 'notifications')
      .leftJoinAndSelect('notifications.post', 'post')
      .leftJoinAndSelect('post.file', 'file')

      .leftJoinAndSelect('notifications.initiatorUser', 'initiatorUser')
      .leftJoinAndSelect('initiatorUser.avatar', 'initiatorUserAvatar')

      .orderBy('notifications.createdAt', 'DESC')
      .getOneOrFail();
    return notifications;
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

  async follow(targetID: number, currentUserID: number): Promise<void> {
    const target = await this.users.findOneOrFail(targetID);
    const user = await this.users.findOneOrFail(currentUserID);
    await this.userFollowings.save({
      user,
      target,
    });
    await this.notificationsService.create({
      type: NotificationTypes.FOLLOWED,
      receiverUserID: targetID,
      initiatorUserID: currentUserID,
    });
  }
  async unfollow(targetID: number, userID: number): Promise<void> {
    const following = await this.getUserFollowedEntity(targetID, userID);
    if (following) {
      await this.userFollowings.delete(following.id);
      await this.notificationsService.deleteLastByInitiatorID(userID, targetID);
    }
  }
  async getUserFollowedEntity(targetID: number, userID: number): Promise<FollowingEntity> {
    return await this.userFollowings
      .createQueryBuilder('follow')
      .where('follow.user.id = :userID', { userID })
      .andWhere('follow.target.id = :targetID', { targetID })
      .getOne();
  }
  async getIsUserFollowed(targetID: number, userID: number): Promise<boolean> {
    return Boolean(await this.getUserFollowedEntity(targetID, userID));
  }
  async getUserFollowers(userID: number): Promise<FollowingEntity[]> {
    return await this.userFollowings
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.user', 'user')
      .andWhere('follow.target.id = :userID', { userID })
      .getMany();
  }

  async getSuggestions(page: number, limit: number, currentUserID: number): Promise<UserSuggestion[]> {
    const currentUserFollowings = await this.userFollowings
      .createQueryBuilder('following')
      .where('following.user.id = :currentUserID', { currentUserID })
      .getRawMany();
    const currentUserFollowingIDs = currentUserFollowings.map((f) => f.following_targetId);

    // TODO: fix pagination
    // TODO: fix when 1 user in 2 arrays

    const followersThatCurrentUserDontFollowQB = this.userFollowings
      .createQueryBuilder('following')
      .leftJoinAndSelect('following.user', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .orderBy('following.createdAt', 'DESC')
      .take(Math.floor(limit / 3))
      .skip((page - 1) * Math.floor(limit / 3))
      .where('following.target.id = :currentUserID', { currentUserID })
      .andWhere('following.user.id != :currentUserID', { currentUserID })
      .andWhere('following.user.id NOT IN  (:...currentUserFollowingIDs)', {
        currentUserFollowingIDs,
      });
    const followersThatCurrentUserDontFollow = currentUserFollowingIDs.length
      ? await followersThatCurrentUserDontFollowQB.getMany()
      : [];
    const usersThatCurrentUserDontFollow = followersThatCurrentUserDontFollow.map((f) => {
      return {
        id: f.user.id,
        color: f.user.color,
        avatar: f.user.avatar,
        username: f.user.username,
        suggestion: 'Follows you',
      };
    });

    const followedByYourFollowedQB = this.userFollowings
      .createQueryBuilder('following')
      .leftJoinAndSelect('following.user', 'user')
      .leftJoinAndSelect('following.target', 'target')
      .leftJoinAndSelect('target.avatar', 'avatar')
      .orderBy('following.createdAt', 'DESC')
      .take(Math.floor(limit / 3))
      .skip((page - 1) * Math.floor(limit / 3))
      .where('following.user.id != :currentUserID', { currentUserID })
      .andWhere('following.target.id != :currentUserID', { currentUserID })
      .andWhere('following.user.id IN (:...currentUserFollowingIDs)', {
        currentUserFollowingIDs,
      })
      .andWhere('following.target.id NOT IN  (:...currentUserFollowingIDs)', {
        currentUserFollowingIDs,
      });
    const followedByYourFollowed = currentUserFollowingIDs.length ? await followedByYourFollowedQB.getMany() : [];
    const followedUsersByYourFollowed = followedByYourFollowed.map((f) => {
      return {
        id: f.target.id,
        color: f.target.color,
        avatar: f.target.avatar,
        username: f.target.username,
        suggestion: `Followed by ${f.user.username}`,
      };
    });

    const userIDsThatCurrentUserDontFollow = usersThatCurrentUserDontFollow.map((u) => u.id);
    const lastNewUsersQB = this.users
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id != :currentUserID', { currentUserID })
      .take(Math.floor(limit / 3))
      .skip((page - 1) * Math.floor(limit / 3));
    if (userIDsThatCurrentUserDontFollow.length)
      lastNewUsersQB.andWhere('user.id NOT IN  (:...userIDsThatCurrentUserDontFollow)', {
        userIDsThatCurrentUserDontFollow,
      });
    const lastNewUsers = await lastNewUsersQB.getMany();

    const formattedLastNewUsers = lastNewUsers.map((u) => {
      return {
        id: u.id,
        color: u.color,
        avatar: u.avatar,
        username: u.username,
        suggestion: 'New to Instagram',
      };
    });
    return [...formattedLastNewUsers, ...usersThatCurrentUserDontFollow, ...followedUsersByYourFollowed];
  }

  async getRecentSearch(userID: number): Promise<(UserEntity | TagEntity)[]> {
    const user = await this.users
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userID })
      .leftJoinAndSelect('user.recentSearch', 'recentSearch')
      .orderBy('recentSearch.createdAt', 'DESC')
      .getOneOrFail();
    return await Promise.all(
      user.recentSearch.map(async (item) => {
        return item.type === 'user'
          ? { ...(await this.users.findOne(item.itemID)), recentSearchID: item.id }
          : { ...(await this.postsService.getTagByID(item.itemID)), recentSearchID: item.id };
      })
    );
  }
  async addRecentSearch(id: number, type: 'user' | 'tag', userID: number): Promise<number> {
    const user = await this.users.findOneOrFail(userID, { relations: ['recentSearch'] });
    const repeatIndex = user.recentSearch.findIndex((rc) => rc.itemID === id && rc.type === type);
    if (repeatIndex !== -1) await this.recentSearch.delete(user.recentSearch[repeatIndex].id);
    const rc = await this.recentSearch.save({
      itemID: id,
      type,
      user,
    });
    return rc.id;
  }
  async removeRecentSearch(id: number): Promise<void> {
    await this.recentSearch.delete(id);
  }
}
