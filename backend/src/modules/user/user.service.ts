import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto';
import { UserEntity, UserSuggestion } from './entity/user.entity';

import { FilesService } from '../files/files.service';
import { PublicFileEntity } from '../files/entity/public-file.entity';
import { CreateUserGithubDTO } from './dto';
import { NotificationEntity } from '../notifications/entity/notification.entity';
import { FollowingEntity } from './entity/following.entity';
import { CommentEntity } from '../posts/entity/comment.entity';
import { PostsService } from '../posts/posts.service';
import { RecentSearchEntity } from './entity/recentSearch.entity';
import { TagEntity } from '../posts/entity/tag.entity';

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
    private readonly postsService: PostsService
  ) {}

  async getAll(search: string, currentUserID: number): Promise<UserEntity[]> {
    console.log('all following entit', await this.userFollowings.find({ where: { id: currentUserID } }));

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
          fileURL: p.file?.url,
          likesNumber: await this.postsService.getPostLikesCount(user, p),
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

  async getLikedComments(id: number): Promise<CommentEntity[]> {
    const user = await this.users.findOneOrFail(id, { relations: ['likedComments'] });
    return user.likedComments;
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
    const target = await this.users.findOneOrFail(id);
    const user = await this.users.findOneOrFail(currentUserID);
    await this.userFollowings.save({
      user,
      target,
    });
  }
  async unfollow(targetID: number, userID: number): Promise<void> {
    const following = await this.getUserFollowedEntity(targetID, userID);
    if (following) await this.userFollowings.delete(following.id);
  }
  async getUserFollowedEntity(targetID: number, userID: number): Promise<FollowingEntity> {
    // TODO: it always find some following entity even if it doesn't exists before. maybe it creates it somehow? wtf
    return await this.userFollowings
      .createQueryBuilder('follow')
      .leftJoin('follow.user', 'user')
      .leftJoin('follow.target', 'target')
      .where('user.id = :userID', { userID })
      .andWhere('target.id = :targetID', { targetID })
      .getOne();
  }
  async getIsUserFollowed(targetID: number, userID: number): Promise<boolean> {
    return Boolean(this.getUserFollowedEntity(targetID, userID));
  }

  async getSuggestions(page: number, limit: number, currentUserID: number): Promise<UserSuggestion[]> {
    // TODO: figure out

    // https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#using-subqueries

    // const currentUser = await this.users.findOneOrFail(currentUserID, { relations: ['followers', 'followedUsers'] });
    // const followersThatCurrentUserDontFollow = await this.userFollowings
    //   .createQueryBuilder('following')
    //   .where('following.target = :currentUserID', { currentUserID })
    //   // TODO: need to get all users that current user not follow. use subquery?
    //   .andWhere('following.user = :', { currentUserID })
    //   .take(1)
    //   .getMany();
    // suggestion: Follows you

    // const followedByYourFollowed = await this.userFollowings
    //   .createQueryBuilder('following')
    //    // TODO
    //   .where('following.target IN ' )
    //   .take(1)
    //   .getMany();
    // // suggestion: Followed by USERNAME

    // SELECT * FROM Customers
    // WHERE Country IN (SELECT Country FROM Suppliers);

    const lastNewUsers = await this.users.find({
      where: {
        id: Not(currentUserID),
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return lastNewUsers.map((u) => {
      return {
        id: u.id,
        color: u.color,
        avatar: u.avatar,
        username: u.username,
        suggestion: 'New to Instagram',
      };
    });
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
          ? await this.users.findOne(item.itemID)
          : await this.postsService.getTagByID(item.itemID);
      })
    );
  }
  async addRecentSearch(id: number, type: 'user' | 'tag', userID: number): Promise<void> {
    const user = await this.users.findOneOrFail(userID, { relations: ['recentSearch'] });
    const repeatIndex = user.recentSearch.findIndex((rc) => rc.itemID === id && rc.type === type);
    if (repeatIndex !== -1) await this.recentSearch.delete(user.recentSearch[repeatIndex].id);
    await this.recentSearch.save({
      itemID: id,
      type,
      user,
    });
  }
  async removeRecentSearch(id: number): Promise<void> {
    await this.recentSearch.delete(id);
  }
}
