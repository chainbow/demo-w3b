import * as mongoose from "mongoose";
import { Model } from "mongoose";

export interface AuthUser {
  userAddress: string;
  userName: string;
}

export const AuthUserSchema = new mongoose.Schema<AuthUser>(
  {
    userAddress: {type: String, required: true, unique: true},
    userName: {type: String, required: true, unique: true},
  },
  {
    versionKey: false,
  },
);

export const AuthUserModel = (mongoose.models.authUser as Model<AuthUser>) || mongoose.model<AuthUser>("authUser", AuthUserSchema);
