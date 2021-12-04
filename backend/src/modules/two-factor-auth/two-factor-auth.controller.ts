import { BadRequestException, Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { UserTokensInterface } from '../user/entity/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@Controller('2fa')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('generate')
  async generate(@Request() req): Promise<string> {
    const { otpURL } = await this.twoFactorAuthService.generateSecret(req.user);
    return this.twoFactorAuthService.getQrCodeURL(otpURL);
  }

  @Post('enable')
  @HttpCode(200)
  async enable(@Body('code') code: string, @Request() req): Promise<boolean> {
    const isValid = await this.twoFactorAuthService.isValid(code, req.user.id);
    if (!isValid) throw new BadRequestException('WRONG_OTP_CODE');

    return await this.userService.enable2FA(req.user.id);
  }

  @Public()
  @Post('auth')
  @HttpCode(200)
  async auth(@Body('code') code: string, @Body('email') email: string): Promise<UserTokensInterface> {
    const user = await this.userService.getByEmail(email);
    const isValid = await this.twoFactorAuthService.isValid(code, user.id);
    if (!isValid) throw new BadRequestException('WRONG_OTP_CODE');

    return this.authService.login(user, true);
  }
}
