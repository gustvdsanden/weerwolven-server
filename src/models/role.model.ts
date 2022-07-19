import { model, Schema } from 'mongoose';

export type Role = {
  name: string;
};

const roleSchema = new Schema<Role>({
  name: { type: String, required: true },
});

export const RoleModel = model<Role>('Role', roleSchema);
