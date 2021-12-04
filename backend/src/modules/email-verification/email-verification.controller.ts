import { Body, Controller, Post, Request } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Public()
  @Post()
  async confirm(@Body('token') token: string): Promise<boolean> {
    const email = await this.emailVerificationService.confirmToken(token);
    return await this.emailVerificationService.confirmEmail(email);
  }

  @Public()
  @Post('resend')
  resend(@Request() req): Promise<void> {
    return this.emailVerificationService.resend(req.user.id);
  }
}
