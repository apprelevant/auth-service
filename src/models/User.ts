import { Document, Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface User {
  id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
}

export const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  // only do this for new users
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    // hash password so as not to save as cleartext
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.createAccessToken = function (uuid: string): string {
  const accessToken = jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      issuer: process.env.ACCESS_TOKEN_ISSUER,
      jwtid: uuid,
    }
  );
  return accessToken;
};

UserSchema.methods.createRefreshToken = function (uuid: string): string {
  const refreshToken = jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      issuer: process.env.ACCESS_TOKEN_ISSUER,
      jwtid: uuid,
    }
  );
  return refreshToken;
};

export interface UserDocument extends Document {
  email: string;
  password: string;
  username: string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  createAccessToken: (uuid: string) => Promise<string>;
  createRefreshToken: (uuid: string) => Promise<string>;
}

export default model<UserDocument>('User', UserSchema);
