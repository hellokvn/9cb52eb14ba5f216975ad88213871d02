import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward, RewardRepository } from '@/entity/reward';
import { User, UserRepository } from '@/entity/user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), TypeOrmModule.forFeature([Reward, RewardRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
