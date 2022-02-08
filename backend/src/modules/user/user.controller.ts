import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { UserEntity, UserSuggestion } from './entity/user.entity';
import { UserService } from './user.service';

import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicFileEntity } from '../files/entity/public-file.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Query('search') search: string, @Request() req): Promise<UserEntity[]> {
    return await this.userService.getAll(search, req.user.id);
  }

  @Get('self')
  async getSelf(@Request() req): Promise<UserEntity> {
    return await this.userService.getByID(req.user.id);
  }

  @Get('suggestions')
  async getSuggestions(@Request() req): Promise<UserSuggestion[]> {
    return await this.userService.getSuggestions(req.user.id);
  }

  @Public()
  @Get('is-username-taken')
  async isUsernameTaken(@Query('username') username: string): Promise<boolean> {
    return await this.userService.isUsernameTaken(username);
  }
  @Public()
  @Get('is-email-taken')
  async isEmailTaken(@Query('email') email: string): Promise<boolean> {
    return await this.userService.isEmailTaken(email);
  }

  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<PublicFileEntity> {
    return await this.userService.setUserImage(file, 'avatar', req.user.id);
  }

  @Get(':username')
  async getProfileByUsername(@Param('username') username: string): Promise<UserEntity> {
    return await this.userService.getProfileByUsername(username);
  }
  @Patch(':id')
  async update(@Param('id') id: number, @Body() payload: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userService.update(id, payload);
  }

  @Post('follow/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async follow(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.userService.follow(id, req.user.id);
  }
  @Post('unfollow/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.userService.unfollow(id, req.user.id);
  }
}
