import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, Index } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@Index('reward_available_at_user', ['availableAt', 'user'], { unique: true })
export class Reward {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'timestamp' })
  @Index()
  public availableAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public redeemedAt: Date | null;

  @Column({ type: 'timestamp' })
  public expiresAt: Date;

  /*
   * Many To One Relations
   */

  @ManyToOne(() => User, (user) => user.rewards, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User;
}
