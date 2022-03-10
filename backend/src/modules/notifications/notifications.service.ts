import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from './entity/notification.entity';
import { CreateNotificationDTO, UpdateNotificationDTO } from './dto';

import { UserService } from '../user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notifications: Repository<NotificationEntity>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getAll(userID: number): Promise<NotificationEntity[]> {
    return this.userService.getNotifications(userID);
  }

  async create(payload: CreateNotificationDTO): Promise<NotificationEntity> {
    const isSameUserAndNotNeedNotification = payload.receiverUserID === payload.initiatorUserID;
    if (isSameUserAndNotNeedNotification) return;

    const item = this.notifications.create({
      type: payload.type,
      receiverUser: { id: payload.receiverUserID },
      initiatorUser: { id: payload.initiatorUserID },
      post: payload.postID ? { id: payload.postID } : null,
      comment: payload.commentID ? { id: payload.commentID } : null,
    });
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

  async deleteLastByInitiatorID(initiatorID: number, receiverID): Promise<void> {
    const notificationArray = await this.notifications
      .createQueryBuilder('notification')
      .where('notification.receiverUser.id = :receiverID', { receiverID })
      .where('notification.initiatorUser.id = :initiatorID', { initiatorID })
      .orderBy('notification.createdAt', 'DESC')
      .take(1)
      .getMany();
    const notification = notificationArray?.[0];
    if (notification) await this.notifications.delete(notification.id);
  }
}
