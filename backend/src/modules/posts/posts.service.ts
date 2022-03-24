import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateCommentDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate/index';

import { PostEntity } from './entity/post.entity';
import { CommentEntity } from './entity/comment.entity';
import { ReportEntity } from './entity/report.entity';
import { TagEntity } from './entity/tag.entity';

import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { PostLikeEntity } from './entity/postLike.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTypes } from '../notifications/entity/notification.entity';
import { PostFeedEntity } from './entity/postFeed.entity';
import { CommentLikeEntity } from './entity/commentLike.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private posts: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private postLikes: Repository<PostLikeEntity>,
    @InjectRepository(PostFeedEntity)
    private postFeed: Repository<PostFeedEntity>,

    @InjectRepository(ReportEntity)
    private postReports: Repository<ReportEntity>,

    @InjectRepository(CommentEntity)
    private postComments: Repository<CommentEntity>,
    @InjectRepository(CommentLikeEntity)
    private postCommentLikes: Repository<CommentLikeEntity>,

    @InjectRepository(TagEntity)
    private postTags: Repository<TagEntity>,

    @Inject(FilesService)
    private readonly filesService: FilesService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService
  ) {}

  async getAll(
    queryOptions: IPaginationOptions = { page: 1, limit: 10 },
    tag = '',
    userID: number
  ): Promise<Pagination<PostEntity>> {
    const currentUser = await this.userService.getByID(userID);

    if (!tag) {
      const userPostFeed = await this.postFeed
        .createQueryBuilder('feed')
        .leftJoinAndSelect('feed.post', 'post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('author.avatar', 'avatar')
        .leftJoinAndSelect('post.file', 'file')
        .leftJoinAndSelect('post.tags', 'tags')

        .where('feed.user.id = :userID', { userID })
        .orderBy('feed.createdAt', 'DESC')

        .take(Number(queryOptions.limit))
        .skip((Number(queryOptions.page) - 1) * Number(queryOptions.limit))
        .getMany();
      const feedPosts = userPostFeed.map((f) => f.post);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const recentOwnPosts =
        Number(queryOptions.page) === 1
          ? await this.posts
              .createQueryBuilder('post')
              .leftJoinAndSelect('post.author', 'author')
              .leftJoinAndSelect('author.avatar', 'avatar')
              .leftJoinAndSelect('post.file', 'file')
              .leftJoinAndSelect('post.tags', 'tags')
              .where('author.id = :userID', { userID })
              .andWhere('post.createdAt > :yesterday', { yesterday })
              .orderBy('post.createdAt', 'DESC')
              .take(5)
              .getMany()
          : [];
      const allPosts = [...recentOwnPosts, ...feedPosts];

      const formattedFeedPosts = (await Promise.all(
        allPosts.map(async (p) => this.formatPost(p, currentUser, tag))
      )) as PostEntity[];

      if (formattedFeedPosts.length)
        return {
          items: formattedFeedPosts,
          meta: {
            currentPage: Number(queryOptions.page),
            itemCount: formattedFeedPosts.length,
            itemsPerPage: Number(queryOptions.limit),
            // TODO: is it has any sense to make real pagination values?
            totalItems: 50,
            totalPages: 10,
          },
        };
    }

    const queryBuilder = this.posts
      .createQueryBuilder()
      .select('post')
      .from(PostEntity, 'post')
      .leftJoin('post.likes', 'likes')
      .leftJoin('post.comments', 'comments')
      .addSelect(
        'COUNT(likes) + COUNT(comments) * 5 / (EXTRACT(EPOCH FROM NOW()) - EXTRACT(EPOCH FROM post.createdAt))',
        'score'
      )
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.avatar', 'avatar')
      .leftJoinAndSelect('post.file', 'file')
      .leftJoinAndSelect('post.tags', 'tags')
      .orderBy('score', 'DESC')
      .groupBy('post.id')
      .addGroupBy('author.id')
      .addGroupBy('avatar.id')
      .addGroupBy('file.id')
      .addGroupBy('tags.id');

    // TODO: not working
    if (tag) queryBuilder.where('tags.name IN :tag', { tag });
    // if (tag) queryBuilder.where(':tag IN post.tags', { tag });
    else {
      const postsFeed = await this.postFeed
        .createQueryBuilder('feed')
        .select('feed.id')
        .where('feed.user.id = :userID', { userID })
        .getMany();
      const postsFeedIDs = postsFeed.map((pf) => pf.id);
      // TODO: not working. there are still post duplicates
      if (postsFeedIDs.length) queryBuilder.where('post.id NOT IN (:...postsFeedIDs)', { postsFeedIDs });
    }

    const { items, meta } = await paginate<PostEntity>(queryBuilder, queryOptions);

    const formattedPosts = (await Promise.all(
      items.map(async (p) => this.formatPost(p, currentUser, tag))
    )) as PostEntity[];
    return { items: formattedPosts, meta };
  }
  async formatPost(p: PostEntity, currentUser: UserEntity, tag: string): Promise<PostEntity> {
    return {
      ...p,
      author: {
        ...p.author,
        isViewerFollowed:
          p.author.id === currentUser.id
            ? false
            : await this.userService.getIsUserFollowed(p.author.id, currentUser.id),
      },
      comments: tag ? [] : await this.postComments.find({ where: { post: p }, order: { createdAt: 'DESC' }, take: 2 }),
      isViewerLiked: await this.getIsUserLikedPost(currentUser, p),
      isViewerSaved: false,
      isViewerInPhoto: false,
    } as PostEntity;
  }

  async getByID(id: number): Promise<PostEntity> {
    // return await this.posts.findOneOrFail(id, { relations: ['users', 'tags'] });
    return await this.posts.findOneOrFail(id, { relations: ['author', 'tags'] });
  }
  async getComments(id: number, currentUserID: number): Promise<CommentEntity[]> {
    const currentUserRootComments = await this.postComments
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('author.avatar', 'avatar')
      .where('comment.author.id = :currentUserID', { currentUserID })
      .andWhere('comment.post.id = :postID', { postID: id })
      .andWhere('comment.parentComment IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
    const restRootComments = await this.postComments
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('author.avatar', 'avatar')
      .where('comment.author.id != :currentUserID', { currentUserID })
      .andWhere('comment.post.id = :postID', { postID: id })
      .andWhere('comment.parentComment IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
    const allComments = [...currentUserRootComments, ...restRootComments];

    const treeRepository = await getManager().getTreeRepository(CommentEntity);

    return await Promise.all(
      allComments.map(async (c) => {
        // TODO: missing typeorm types?
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // TODO: missing author relation
        const { replies } = await treeRepository.findDescendantsTree(c, { relations: ['author'] });

        return {
          ...c,
          replies,
          isViewerLiked: Boolean(
            await this.postCommentLikes
              .createQueryBuilder('commentLike')
              .where('commentLike.user.id = :currentUserID', { currentUserID })
              .andWhere('commentLike.comment.id = :commentID', { commentID: c.id })
              .getRawOne()
          ),
        };
      })
    );
  }
  async getLikes(id: number, currentUserID: number): Promise<UserEntity[]> {
    const post = await this.posts.findOneOrFail(id, { relations: ['likes'] });
    return (await Promise.all(
      post.likes.map(async (like) => {
        return {
          ...like.user,
          isViewerFollowed: await this.userService.getIsUserFollowed(like.user.id, currentUserID),
        };
      })
    )) as UserEntity[];
  }
  async getLikedPostsByUserID(id: number): Promise<PostEntity[]> {
    const likes = await this.postLikes.createQueryBuilder('likes').where('user.id = :id', { id }).getMany();
    return likes.map((l) => l.post);
  }
  async getIsUserLikedPost(user: UserEntity, post: PostEntity): Promise<boolean> {
    return Boolean(await this.postLikes.findOne({ where: { user, post }, relations: ['user', 'post'] }));
  }

  async getTags(search: string): Promise<TagEntity[]> {
    if (!search.length) return [];
    return this.postTags
      .createQueryBuilder()
      .select('tag')
      .from(TagEntity, 'tag')
      .leftJoin('tag.posts', 'posts')
      .addSelect('COUNT(posts)', 'count')
      .where('tag.name ILIKE :search', { search: `%${search}%` })
      .loadRelationCountAndMap('tag.count', 'tag.posts')
      .orderBy('count', 'DESC')
      .groupBy('tag.id')
      .take(20)
      .getMany();
  }
  async getTagByID(id: number): Promise<TagEntity> {
    return await this.postTags
      .createQueryBuilder('tag')
      .where('tag.id = :id', { id })
      .loadRelationCountAndMap('tag.postsNumber', 'tag.posts')
      .getOne();
  }
  async getTagByName(name: string): Promise<TagEntity> {
    return await this.postTags
      .createQueryBuilder('tag')
      .where('tag.name = :name', { name })
      .loadRelationCountAndMap('tag.postsNumber', 'tag.posts')
      .getOneOrFail();
  }

  async create(file: Express.Multer.File, payload: CreatePostDTO, userID: number): Promise<PostEntity> {
    const user = await this.userService.getByID(userID);
    const uploadedFile = await this.filesService.uploadPublicFile({
      file,
      quality: 95,
      imageMaxSizeMB: 20,
      type: 'image',
    });
    const post = await this.posts.save({
      description: payload.description,
      file: uploadedFile,
      author: user,
    });

    try {
      const parsedTags = JSON.parse(payload.tags);
      const formattedTags = await Promise.all(
        parsedTags?.map(async (t) => {
          const tagEntity = await this.postTags.findOne({ where: { name: t } });
          if (!tagEntity)
            return {
              name: t,
            };
          else
            return {
              id: tagEntity.id,
            };
        })
      );

      const savedPost = await this.posts.save({
        ...post,
        tags: formattedTags,
      });

      const allUserFollowers = await this.userService.getUserFollowers(userID);
      console.log('allUserFollowers', allUserFollowers);
      // TODO: move to queue?
      await Promise.all(
        allUserFollowers.map(async (following) => {
          await this.postFeed.save({
            user: following.user,
            post: savedPost,
          });
          const feedCount = await this.postFeed.count({ where: { user: following.user } });
          console.log('feedCount', feedCount);
          const maxUserFeedNumber = 20;
          if (feedCount > maxUserFeedNumber) {
            const oldestPost = await this.postFeed.findOne({
              where: { user: following.user },
              order: { createdAt: 'ASC' },
            });
            await this.postFeed.delete(oldestPost.id);
          }
        })
      );
    } catch (e) {
      console.log(e);
    }

    return post;
  }

  async update(id: number, payload: UpdatePostDTO): Promise<PostEntity> {
    if (payload.tags) {
      try {
        const parsedTags = JSON.parse(payload.tags);
        const formattedTags = await Promise.all(
          parsedTags?.map(async (t) => {
            const tagEntity = await this.postTags.findOne({ where: { name: t } });
            if (!tagEntity)
              return {
                name: t,
              };
            else
              return {
                id: tagEntity.id,
              };
          })
        );
        const formattedPayload = {
          ...payload,
          tags: formattedTags,
        };
        const toUpdate = await this.posts.findOneOrFail(id);
        const updated = this.posts.create({ ...toUpdate, ...formattedPayload });
        await this.posts.save(updated);
        return updated;
      } catch (e) {
        console.log(e);
      }
    } else {
      // TODO: check is it properly work
      // const { tags, ...formattedPayload } = payload;
      delete payload.tags;

      const toUpdate = await this.posts.findOneOrFail(id);
      const updated = this.posts.create({ ...toUpdate, ...(payload as Omit<UpdatePostDTO, 'tags'>) });
      await this.posts.save(updated);
      return updated;
    }
  }

  async delete(id: number): Promise<void> {
    await this.posts.delete(id);
  }

  async report(id: number, reasonID: number, userID: number): Promise<void> {
    const post = await this.posts.findOneOrFail(id);
    const user = await this.userService.getByID(userID);
    await this.postReports.save({
      reporter: user,
      reported: post,
      reasonID,
    });
  }
  async share(id: number, userID: number): Promise<void> {
    console.log('share', id, userID);
  }

  async toggleLike(postID: number, currentUserID: number): Promise<void> {
    const like = await this.postLikes
      .createQueryBuilder('like')
      .where('like.user.id = :currentUserID', { currentUserID })
      .andWhere('like.post.id = :postID', { postID })
      .getOne();
    const { author } = await this.posts.findOneOrFail(postID);

    if (like) {
      await this.postLikes.delete(like.id);
      await this.notificationsService.deleteByPostID(postID, currentUserID);
    } else {
      await this.postLikes.save({ post: { id: postID }, user: { id: currentUserID } });
      await this.notificationsService.create({
        type: NotificationTypes.LIKED_PHOTO,
        receiverUserID: author.id,
        initiatorUserID: currentUserID,
        postID,
      });
    }
  }

  async createComment({ text, postID, replyCommentID }: CreateCommentDTO, userID: number): Promise<CommentEntity> {
    const user = await this.userService.getByID(userID);
    const post = await this.posts.findOneOrFail(postID);
    const parentComment = replyCommentID ? await this.postComments.findOneOrFail(replyCommentID) : null;

    const comment = await this.postComments.save({ text, post, author: user, parentComment });

    delete comment.post;
    delete comment.parentComment;
    return { ...comment, postID };
  }
  async updateComment(id: number, text: string): Promise<CommentEntity> {
    const toUpdate = await this.postComments.findOneOrFail(id, { relations: ['post'] });
    const updated = this.postComments.create({ ...toUpdate, text });
    await this.postComments.save(updated);

    const postID = updated.post.id;
    delete updated.post;
    delete updated.parentComment;
    return { ...updated, postID };
  }
  async deleteComment(id: number): Promise<void> {
    await this.postComments.delete(id);
  }
  async toggleCommentLike(commentID: number, currentUserID: number): Promise<void> {
    const like = await this.postCommentLikes
      .createQueryBuilder('like')
      .where('like.user.id = :currentUserID', { currentUserID })
      .andWhere('like.comment.id = :commentID', { commentID })
      .getOne();
    const { author, post } = await this.postComments.findOneOrFail(commentID, { relations: ['post'] });

    if (like) {
      await this.postCommentLikes.delete(like.id);
      await this.notificationsService.deleteByPostID(post.id, currentUserID);
    } else {
      await this.postCommentLikes.save({ comment: { id: commentID }, user: { id: currentUserID } });
      await this.notificationsService.create({
        type: NotificationTypes.LIKED_COMMENT,
        receiverUserID: author.id,
        initiatorUserID: currentUserID,
        postID: post.id,
        commentID,
      });
    }
  }
}
