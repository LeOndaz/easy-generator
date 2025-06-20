import mongoose from 'mongoose';
import { UserSchema } from '../users/schemas/user.schema';

type RequestUser = Omit<UserSchema, 'password'> & { _id: mongoose.Types.ObjectId };

declare global {
  namespace Express {
    // this rule just makes sure if at some point we enable it
    // this file doesn't break the build

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends RequestUser {}
  }
}
