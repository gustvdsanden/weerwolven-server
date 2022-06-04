import { model, Schema } from 'mongoose';

export type User = {
  id: string;
  name: string;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
});

export const UserModel = model<User>('User', userSchema);
