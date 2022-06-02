import { User } from '../models/user.model';
import { db } from '../models';
const User = db.User;

export function getAllUsers(req: any, res: any) {
  User.find({}).then((users: User[]) => {
    res.send(users);
  });
}

export async function createUser(req: any, res: any) {
  if (await User.findOne({ name: req.body.name }).exec()) {
    res.status(400).send({ message: 'User already exists' });
    return;
  }

  const user = new User(req.body);
  await user
    .save()
    .then((user: User) => {
      res.send(user);
    })
    .catch((err: any) => {
      res.status(400).send(err);
    });
}
