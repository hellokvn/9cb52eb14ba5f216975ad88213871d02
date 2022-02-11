import { IsDateString, IsNumberString } from 'class-validator';

export class UserRewardDto {
  @IsDateString()
  public readonly at: string;
}

export class UserRedeemRewardDto {
  @IsNumberString()
  public readonly id: string;

  @IsDateString()
  public readonly availableAt: string;
}
