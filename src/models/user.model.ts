import { model, Schema } from 'mongoose';

export type User = {
  name: string;
};

const roleSchema = new Schema<User>({
  name: { type: String, required: true },
});

export const RoleModel = model<User>('Role', roleSchema);
