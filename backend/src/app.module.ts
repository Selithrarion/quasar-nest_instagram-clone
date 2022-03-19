import { ClassSerializerInterceptor, Global, HttpException, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';

import { ScheduleModule } from '@nestjs/schedule';
import { EmailScheduleModule } from './modules/email-schedule/email-schedule.module';
import { EmailVerificationModule } from './modules/email-verification/email-verification.module';

import { EmailModule } from './services/email/email.module';
import { TwoFactorAuthModule } from './modules/two-factor-auth/two-factor-auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { RavenInterceptor, RavenModule } from 'nest-raven';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/entity/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RavenModule,

    PostsModule,

    UserModule,
    NotificationsModule,
    AuthModule,

    ScheduleModule.forRoot(),
    EmailScheduleModule,

    EmailModule,
    EmailVerificationModule,
    TwoFactorAuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [{ type: HttpException, filter: (e: HttpException) => 500 > e.getStatus() }],
      }),
    },
  ],
})
export class AppModule {}
