import { Types } from 'mongoose';

export interface AuthenticatedUser {
  _id: Types.ObjectId;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}
