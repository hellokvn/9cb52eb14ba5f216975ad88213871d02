import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findOrCreate(id: number): Promise<User> {
    let user: User = await this.findOne(id);

    if (user) {
      return user;
    }

    user = new User();

    return this.save(user);
  }
}
