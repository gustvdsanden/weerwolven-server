import { User } from '../models/user.model';

export function mapUserForSending(user: User): Omit<User, 'password'> {
  console.log(user);
  return {
    id: user.id,
    name: user.name,
  };
}
