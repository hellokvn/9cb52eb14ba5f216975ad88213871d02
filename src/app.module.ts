import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from '@/common/helper/env.helper';
import { TypeOrmConfigService } from '@/shared/typeorm/typeorm.service';
import { ApiModule } from './api/api.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
  ],
})
export class AppModule {}

// nest g mo api/aa && nest g co api/aa && nest g s api/aa
