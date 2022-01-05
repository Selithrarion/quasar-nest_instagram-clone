import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { CreatePostDTO, UpdatePostDTO } from './dto';
import { PostEntity } from './entity/post.entity';
import { PostsService } from './posts.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(@Query() query: IPaginationOptions, @Request() req): Promise<Pagination<PostEntity>> {
    return await this.postsService.getAll(query, req.user.id);
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<PostEntity> {
    return await this.postsService.getByID(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreatePostDTO,
    @Request() req
  ): Promise<PostEntity> {
    return await this.postsService.create(file, payload, req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() postData: UpdatePostDTO): Promise<PostEntity> {
    return await this.postsService.update(Number(id), postData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.postsService.delete(id);
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleLike(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.postsService.toggleLike(Number(id), req.user.id);
  }
}
