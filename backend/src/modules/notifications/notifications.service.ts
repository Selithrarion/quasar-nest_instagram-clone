import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity, NotificationTypes } from './entity/notification.entity';
import { UpdateNotificationDTO } from './dto';

import { UserService } from '../user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notifications: Repository<NotificationEntity>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getAll(userID: number): Promise<NotificationEntity[]> {
    return this.userService.getNotifications(userID);
  }

  async create(type: NotificationTypes, userID: number, postID: number | null = null): Promise<NotificationEntity> {
    const item = this.notifications.create({ type, user: { id: userID }, post: postID ? { id: postID } : null });
    return await this.notifications.save(item);
  }

  async readAll(userID: number): Promise<void> {
    const notifications = await this.getAll(userID);
    notifications.forEach((n) => {
      if (!n.read) this.notifications.update(n.id, { read: true });
    });
  }

  async update(id: number, payload: UpdateNotificationDTO): Promise<void> {
    await this.notifications.update(id, payload);
  }

  async deleteByID(id: number): Promise<void> {
    await this.notifications.delete(id);
  }

  async deleteByPostID(postID: number, currentUserID: number): Promise<void> {
    const notification = await this.notifications
      .createQueryBuilder('notification')
      .where('notification.post.id = :postID', { postID })
      .andWhere('notification.initiatorUser.id = :currentUserID', { currentUserID })
      .getOne();
    if (notification) await this.notifications.delete(notification.id);
  }
}
