import { Controller, Get, HttpStatus, Inject, Param, Patch, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { Reward } from '@/entity/reward';
import { Data } from '@/common/types/data.types';
import { UserRedeemRewardDto, UserRewardDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get('/:id/rewards')
  @ApiOperation({ summary: 'Get Rewards By User ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'at', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The request was successful.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The query is not valid.' })
  public getRewards(@Query() _: UserRewardDto, @Req() req: Request): Promise<Data<Reward[]>> {
    return this.service.getRewards(req);
  }

  @Patch('/:id/rewards/:availableAt/redeem')
  @ApiOperation({ summary: 'Redeem Reward By User ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'availableAt', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'The request was successful.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The params are not valid.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'This reward is already expired.' })
  public redeemReward(@Param() _: UserRedeemRewardDto, @Req() req: Request): Promise<Data<Reward>> {
    return this.service.redeemReward(req);
  }
}
