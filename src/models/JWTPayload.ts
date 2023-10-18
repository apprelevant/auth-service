import { Types } from 'mongoose';

export interface JWTPayload {
  _id: Types.ObjectId;
  email: string;
  iat: Date;
  exp: Date;
  iss: string;
  jti: string;
}
