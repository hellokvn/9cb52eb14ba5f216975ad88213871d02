import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Reward, RewardRepository } from '@/entity/reward';
import { User, UserRepository } from '@/entity/user';
import { getWeekDates, normalizeDate } from '@/common/helper/date.helper';
import { Data } from '@/common/types/data.types';

@Injectable()
export class UserService {
  @InjectRepository(UserRepository)
  public readonly repository: UserRepository;

  @InjectRepository(RewardRepository)
  public readonly rewardRepository: RewardRepository;

  public async getRewards(req: Request): Promise<Data<Reward[]>> {
    const id: number = Number.parseInt(req.params.id, 10) || 0;
    const at: Date = normalizeDate(<string>req.query.at);
    const user: User = await this.repository.findOrCreate(id);
    const rewards: Reward[] = await this.rewardRepository.findWeekByUser(at, user);

    if (!rewards.length) {
      const week: Date[] = getWeekDates(at);

      week.forEach((date: Date) => {
        const reward: Reward = new Reward();

        reward.user = user;
        reward.availableAt = date;
        reward.expiresAt = new Date(date.getTime() + 86400000);

        rewards.push(reward);
      });

      await this.rewardRepository.save(rewards);

      rewards.forEach((reward: Reward) => {
        delete reward.id;
        delete reward.user;
      });
    }

    return { data: rewards };
  }

  public async redeemReward(req: Request): Promise<Data<Reward>> {
    const id: number = Number.parseInt(req.params.id, 10) || 0;
    const availableAt: Date = normalizeDate(req.params.availableAt);
    const reward: Reward = await this.rewardRepository.findOneValidByDate(availableAt, id);

    if (!reward) {
      throw new HttpException('This reward is already expired', HttpStatus.CONFLICT);
    }

    reward.redeemedAt = new Date();

    this.rewardRepository.update(reward.id, { redeemedAt: reward.redeemedAt });

    return { data: reward };
  }
}
