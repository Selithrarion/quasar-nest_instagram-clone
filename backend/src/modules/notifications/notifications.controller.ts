import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './entity/notification.entity';
import { UpdateNotificationDTO } from './dto';

@Controller('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAll(@Request() req): Promise<NotificationEntity[]> {
    return await this.notificationsService.getAll(req.user.id);
  }

  @Post('read-all')
  async readAll(@Request() req): Promise<void> {
    return await this.notificationsService.readAll(req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() payload: UpdateNotificationDTO): Promise<void> {
    return await this.notificationsService.update(+id, payload);
  }

  @Delete(':id')
  async deleteByID(@Param('id') id: number): Promise<void> {
    return await this.notificationsService.deleteByID(+id);
  }
}
