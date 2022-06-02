import { model, Schema } from 'mongoose';

export type User = {
  name: string;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
});

export const UserModel = model<User>('User', userSchema);
