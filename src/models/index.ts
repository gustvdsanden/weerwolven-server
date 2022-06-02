import mongoose from 'mongoose';
import { url } from '../config/db.config';

import { RoleModel } from './role.model';
import { UserModel } from './user.model';

mongoose.Promise = global.Promise;
type db = {
  mongoose: typeof mongoose;
  url: string;
  Role: typeof RoleModel;
  User: typeof UserModel;
  seed: () => Promise<void>;
};

export const db: db = {
  mongoose: mongoose,
  url: url,

  Role: RoleModel,
  User: UserModel,

  seed: async () => {
    db.Role.findOne().then(async (foundRole) => {
      if (foundRole) return;
      const roles = await db.Role.create(
        { name: 'Civilian' },
        { name: 'Werewolf' },
      );

      roles.forEach(async (role) => await role.save());
    });
  },
};
