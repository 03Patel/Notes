import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  isVerified?: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  verificationToken: { type: String },
  verificationTokenExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
});

export const Usermodel = mongoose.model<IUser>("User", UserSchema);
