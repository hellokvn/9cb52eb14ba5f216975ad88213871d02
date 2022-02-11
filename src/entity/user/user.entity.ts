import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Reward } from '../reward/reward.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  /*
   * Create and Update Date Columns
   */

  // @CreateDateColumn({ type: 'timestamp' })
  // public createdAt!: Date;

  // @UpdateDateColumn({ type: 'timestamp' })
  // public updatedAt!: Date;

  /*
   * One To Many Relations
   */

  @OneToMany(() => Reward, (reward) => reward.user)
  public rewards: Reward[];
}
