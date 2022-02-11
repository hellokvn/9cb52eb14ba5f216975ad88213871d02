import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const appPath: string = resolve(__dirname, '../..');

    return {
      logger: 'file',
      type: this.config.get<'postgres'>('DATABASE_TYPE'),
      host: this.config.get('DATABASE_HOST'),
      port: this.config.get('DATABASE_PORT'),
      username: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASSWORD'),
      database: this.config.get<string>('DATABASE_NAME'),
      entities: [`${appPath}/**/*.entity.{ts,js}`],
      migrations: [`${appPath}/**/migrations/*.{ts,js}`],
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: true,
      synchronize: true,
      logging: true,
    };
  }
}
