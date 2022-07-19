import { User } from '../models/user.model';

export function mapUserForSending(user: User): Omit<User, 'password'> {
  return {
    id: user.id,
    name: user.name,
  };
}
