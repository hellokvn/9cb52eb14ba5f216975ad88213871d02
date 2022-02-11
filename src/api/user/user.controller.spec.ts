import { Data } from '@/common/types/data.types';
import { Reward } from '@/entity/reward';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserController } from './user.controller';
import { UserRedeemRewardDto, UserRewardDto } from './user.dto';
import { UserService } from './user.service';

const mochUserService = {
  getRewards: jest.fn((_: Request): Data<Reward[]> => {
    const reward: Reward = new Reward();
    reward.availableAt = new Date();
    reward.expiresAt = new Date();
    return { data: [reward] };
  }),
  redeemReward: jest.fn((_: Request): Data<Reward> => {
    const reward: Reward = new Reward();
    reward.availableAt = new Date();
    reward.expiresAt = new Date();
    reward.redeemedAt = new Date();
    return { data: reward };
  }),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mochUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return data reward array', () => {
    const query: UserRewardDto = { at: '2022-02-11T00:00:00Z' };

    expect(controller.getRewards(query, { query } as any)).toEqual({
      data: [{ availableAt: expect.any(Date), expiresAt: expect.any(Date) }],
    });
  });

  it('should return data reward', () => {
    const params: UserRedeemRewardDto = { id: '1', availableAt: '2022-02-11T00:00:00Z' };

    expect(controller.redeemReward(params, { params } as any)).toEqual({
      data: { availableAt: expect.any(Date), expiresAt: expect.any(Date), redeemedAt: expect.any(Date) },
    });
  });
});
