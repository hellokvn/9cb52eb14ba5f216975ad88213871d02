import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { writeFileSync } from 'fs';
import { AppModule } from '@/app.module';
import { Env } from './common/enum/env.enum';
import helmet from 'helmet';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;
  const baseUrl: string = config.get<string>('BASE_URL');

  configure(app);

  const swaggerUrl: string = swagger(app);

  await app.listen(port, () => {
    console.log('[NOD]', process.version);
    console.log('[ENV]', process.env.NODE_ENV || Env.Development);
    console.log('[PRT]', port);
    console.log('[WEB]', baseUrl);
    console.log('[SWG]', `${baseUrl}/${swaggerUrl}`);
    console.log('[_DB]', `${config.get('DATABASE_NAME')} @ ${config.get('DATABASE_HOST')}`);
  });
}

export function configure(app: NestExpressApplication): void {
  app.set('trust proxy', 1);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(helmet());
}

function swagger(app: NestExpressApplication): string {
  const url: string = 'swagger';
  const config: any = new DocumentBuilder().setTitle('API').setVersion('1.0.0').build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  writeFileSync(`./${url}.json`, JSON.stringify(document));

  SwaggerModule.setup(url, app, document);

  app.use(`/${url}.json`, (_: Request, res: Response) => res.send(document));

  return url;
}

bootstrap();
