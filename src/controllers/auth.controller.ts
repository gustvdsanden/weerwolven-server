import { User } from '../models/user.model';
import { TypedRequestBody, TypedResponse } from '../types';
import { db } from '../models';
import { mapUserForSending } from '../util';
const User = db.User;

export async function login(
  req: TypedRequestBody<{ name: string; password: string }>,
  res: TypedResponse,
) {
  try {
    const user = await User.findOne({ name: req.body.name }).exec();
    if (user.password !== req.body.password) {
      throw new Error();
    }
    res.status(200).send(mapUserForSending(user));
  } catch {
    res.status(400).send({ message: 'Name or password incorrect' });
  }
}

export async function signUp(
  req: TypedRequestBody<{ name: string; password: string }>,
  res: TypedResponse,
) {
  if (!req.body.name || !req.body.password) {
    res.status(500).send({ message: 'Name or password missing' });
    return;
  }
  if (await User.findOne({ name: req.body.name }).exec()) {
    res.status(400).send({ message: 'Name is taken' });
    return;
  }

  const newUser = new User(req.body);
  await newUser
    .save()
    .then((user: User) => {
      res.send(mapUserForSending(user));
    })
    .catch((err: any) => {
      res.status(400).send(err);
    });
}
