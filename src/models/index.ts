import mongoose from 'mongoose';
import { url } from '../config/db.config';

import { RoleModel } from './role.model';

mongoose.Promise = global.Promise;
type db = {
  mongoose: typeof mongoose;
  url: string;
  Role: typeof RoleModel;
  seed: () => Promise<void>;
};

export const db: db = {
  mongoose: mongoose,
  url: url,

  Role: RoleModel,

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
