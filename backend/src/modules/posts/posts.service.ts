import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate/index';

import { PostEntity } from './entity/post.entity';
import { CommentEntity } from './entity/comment.entity';
import { ReportEntity } from './entity/report.entity';
import { TagEntity } from './entity/tag.entity';

import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private posts: Repository<PostEntity>,
    @InjectRepository(ReportEntity)
    private postReports: Repository<ReportEntity>,
    @InjectRepository(CommentEntity)
    private postComments: Repository<CommentEntity>,
    @InjectRepository(TagEntity)
    private postTags: Repository<TagEntity>,

    @Inject(FilesService)
    private readonly filesService: FilesService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getAll(
    queryOptions: IPaginationOptions = { page: 1, limit: 10 },
    tag = '',
    userID: number
  ): Promise<Pagination<PostEntity>> {
    const currentUser = await this.userService.getByID(userID);

    const queryBuilder = this.posts.createQueryBuilder('post');
    queryBuilder.orderBy('post.createdAt', 'DESC');
    queryBuilder.leftJoinAndSelect('post.author', 'author');
    queryBuilder.leftJoinAndSelect('author.avatar', 'avatar');
    queryBuilder.leftJoinAndSelect('post.file', 'file');
    queryBuilder.leftJoinAndSelect('post.tags', 'tags');
    if (tag) queryBuilder.where('tags.name IN :tag', { tag });

    const { items, meta } = await paginate<PostEntity>(queryBuilder, queryOptions);

    const formattedPosts = (await Promise.all(
      items.map(async (p) => ({
        ...p,
        comments: await this.postComments.find({ where: { post: p }, order: { createdAt: 'DESC' }, take: 2 }),
        fileURL: p.file?.url,
        // TODO: should be replaced with query
        isViewerLiked: currentUser.likedPostsIDs.includes(p.id),
        isViewerSaved: false,
        isViewerInPhoto: false,
      }))
    )) as PostEntity[];
    return { items: formattedPosts, meta };
  }

  async getByID(id: number): Promise<PostEntity> {
    return await this.posts.findOneOrFail(id, { relations: ['users', 'tags'] });
  }
  async getComments(id: number, userID: number): Promise<CommentEntity[]> {
    const post = await this.posts.findOneOrFail(id);
    const currentUser = await this.userService.getByID(userID);

    const comments = await this.postComments.find({
      where: { post },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
    return await Promise.all(
      comments.map((c) => {
        return {
          ...c,
          // TODO: should be replaced with query
          isViewerLiked: currentUser.likedCommentsIDs.includes(c.id),
        };
      })
    );
    // TODO: comment reply find trees no 'where' option
    // const treeRepository = await getManager().getTreeRepository(CommentEntity);
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // const trees = await treeRepository.findTrees({
    //   where: { post },
    //   relations: ['author'],
    // });
    // return trees;
  }
  async getLikes(id: number, currentUserID: number): Promise<UserEntity[]> {
    const post = await this.posts.findOneOrFail(id, { relations: ['likes'] });
    return post.likes.map((user) => {
      return {
        ...user,
        isViewerFollowed: user.followersIDs.includes(currentUserID),
      };
    }) as UserEntity[];
  }

  async getTags(search: string): Promise<TagEntity[]> {
    // TODO: add order by count
    if (!search.length) return [];
    return (
      this.postTags
        .createQueryBuilder('tags')
        .where('name ILIKE :search', { search: `%${search}%` })
        .leftJoin('tags.posts', 'posts')
        // TODO: how to add where with array
        // .addSelect((qb) => {
        //   return qb.select('COUNT(posts)', 'count').from(PostEntity, 'post').where('');
        // }, 'count')
        .loadRelationCountAndMap('tags.count', 'tags.posts')
        // .orderBy('count', 'DESC')
        // TODO: loadRelationCountAndMap not work with orderBy
        // .orderBy('tags.count', 'DESC')
        .take(20)
        .getMany()

      // ?
      // https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#using-subqueries
    );
  }
  async getTagByID(id: number): Promise<TagEntity> {
    return await this.postTags.findOneOrFail(id);
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

      await this.posts.save({
        ...post,
        tags: formattedTags,
      });
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
      const { tags, ...formattedPayload } = payload;
      const toUpdate = await this.posts.findOneOrFail(id);
      const updated = this.posts.create({ ...toUpdate, ...formattedPayload });
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

  async toggleLike(postID: number, userID: number): Promise<void> {
    const userLikedPosts = await this.userService.getLikedPosts(userID);
    const postIndex = userLikedPosts.findIndex((p) => p.id === postID);

    if (postIndex !== -1) {
      userLikedPosts.splice(postIndex, 1);
    } else {
      const post = await this.posts.findOneOrFail(postID);
      userLikedPosts.push(post);
    }

    await this.userService.update(userID, { likedPosts: userLikedPosts });
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
  async toggleCommentLike(commentID: number, userID: number): Promise<void> {
    const userLikedComments = await this.userService.getLikedComments(userID);
    const commentIndex = userLikedComments.findIndex((c) => c.id === commentID);

    if (commentIndex !== -1) {
      userLikedComments.splice(commentIndex, 1);
    } else {
      const comment = await this.postComments.findOneOrFail(commentID);
      userLikedComments.push(comment);
    }

    await this.userService.update(userID, { likedComments: userLikedComments });
  }
}
