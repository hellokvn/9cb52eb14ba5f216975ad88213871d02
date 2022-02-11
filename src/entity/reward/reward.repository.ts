import { EntityRepository, Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { User } from '../user';

@EntityRepository(Reward)
export class RewardRepository extends Repository<Reward> {
  public findWeekByUser(availableAt: Date, user: User): Promise<Reward[]> {
    return this.createQueryBuilder('r')
      .select(['r.availableAt', 'r.expiresAt', 'r.redeemedAt'])
      .where('r.userId = :userId AND r.availableAt >= :availableAt', {
        availableAt,
        userId: user.id,
      })
      .orderBy('id', 'ASC')
      .limit(7)
      .getMany();
  }

  public findOneValidByDate(availableAt: Date, userId: number): Promise<Reward> {
    return this.createQueryBuilder('r')
      .where('r.userId = :userId AND r.availableAt = :availableAt AND r.expiresAt > NOW()', {
        // .where('r.userId = :userId AND r.redeemedAt IS NULL AND r.availableAt = :availableAt AND r.expiresAt > NOW()', {
        availableAt,
        userId,
      })
      .getOne();
  }
}
