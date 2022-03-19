import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import { json, urlencoded } from 'express';
import { config as AwsConfig } from 'aws-sdk';

import * as Sentry from '@sentry/node';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Tracing from '@sentry/tracing';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });

  const configService = app.get(ConfigService);
  AwsConfig.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(process.env.PORT);
}
bootstrap();
