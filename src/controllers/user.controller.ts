import { User } from '../models/user.model';
import { db } from '../models';
import { TypedRequestBody, TypedResponse } from '../types';
import { mapUserForSending } from '../util';
const User = db.User;

export function getAllUsers(
  req: TypedRequestBody<{ name: string; password: string }>,
  res: TypedResponse,
) {
  User.find({}).then((users: User[]) => {
    res.send(users.map(mapUserForSending));
  });
}

export function _getUserById(id: string): Promise<User> {
  return User.findById(id).exec();
}

export function getUserById(
  req: TypedRequestBody<{ name: string; password: string }>,
  res: TypedResponse,
) {
  const id = req.params.id;
  _getUserById(id)
    .then((user: User) => {
      res.send(mapUserForSending(user));
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}
