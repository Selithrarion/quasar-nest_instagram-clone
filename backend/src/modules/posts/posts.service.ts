import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDTO, UpdatePostDTO } from './dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate/index';

import { PostEntity } from './entity/post.entity';
import { UserEntity } from '../user/entity/user.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private posts: Repository<PostEntity>,

    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async getAll(query: IPaginationOptions = { page: 1, limit: 10 }, userID: number): Promise<Pagination<PostEntity>> {
    const currentUser = await this.userService.getByID(userID);
    const { items, meta } = await paginate<PostEntity>(this.posts, query, { order: { createdAt: 'DESC' } });
    const formattedPosts = items.map((p) => ({
      ...p,
      isViewerLiked: currentUser.likedPostsIDs.includes(p.id),
    })) as PostEntity[];
    return { items: formattedPosts, meta };
  }

  async getByID(id: number): Promise<PostEntity> {
    return await this.posts.findOneOrFail(id, { relations: ['users'] });
  }

  async create(payload: CreatePostDTO, user: UserEntity): Promise<PostEntity> {
    return await this.posts.save({
      ...payload,
      author: user,
    });
  }

  async update(id: number, postData: UpdatePostDTO): Promise<PostEntity> {
    const toUpdate = await this.posts.findOneOrFail(id);
    const updated = this.posts.create({ ...toUpdate, ...postData });
    await this.posts.save(updated);
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.posts.delete(id);
  }

  async toggleLike(postID: number, userID: number): Promise<void> {
    const userLikedPosts = await this.userService.getLikedPosts(userID);
    const postIndex = userLikedPosts.findIndex((p) => p.id === postID);

    if (postIndex !== -1) {
      userLikedPosts.splice(postIndex, 1);
    } else {
      const post = await this.posts.findOne(postID);
      userLikedPosts.push(post);
    }

    await this.userService.update(userID, { likedPosts: userLikedPosts });
  }
}
