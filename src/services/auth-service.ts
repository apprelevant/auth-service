import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { LoginDetails } from '../models/LoginDetails';
import { AuthenticatedUser } from '../models/AuthenticatedUser';
import User, { UserDocument } from '../models/User';
import { UserCreationParams } from '../models/UserCreationParams';
import { ExchangeRefreshTokenParams } from '../models/ExchangeRefreshTokenParams';

export default class AuthService {
  loginUserViaEmail = async (
    authDetails: LoginDetails
  ): Promise<AuthenticatedUser> => {
    const user = await User.findOne({ email: authDetails.email });

    if (!user) {
      throw new Error('Unauthorized');
    }
    if (!(await user.comparePassword(authDetails.password))) {
      throw new Error('Unauthorized');
    }

    const uuid = uuidv4();
    const accessToken = await user.createAccessToken(uuid);
    const refreshToken = await user.createRefreshToken(uuid);

    return {
      _id: user._id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  };

  registerUserViaEmail = async (
    userDetails: UserCreationParams
  ): Promise<AuthenticatedUser> => {
    try {
      const user: UserDocument = await User.create(userDetails);
      const uuid = uuidv4();
      const accessToken = await user.createAccessToken(uuid);
      const refreshToken = await user.createRefreshToken(uuid);

      return {
        _id: user._id,
        email: user.email,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Could not create new user');
    }
  };

  exchangeRefreshToken = async (
    exchangeRefreshTokenParams: ExchangeRefreshTokenParams,
    user: AuthenticatedUser
  ): Promise<AuthenticatedUser> => {
    try {
      const decodedRefreshToken = jwt.verify(
        exchangeRefreshTokenParams.refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ) as AuthenticatedUser;
      if (
        decodedRefreshToken?._id === user?._id &&
        decodedRefreshToken?.email === user?.email
      ) {
        const user = await User.findById(decodedRefreshToken._id);
        if (user) {
          const uuid = uuidv4();
          const accessToken = await user.createAccessToken(uuid);
          const refreshToken = await user.createRefreshToken(uuid);

          return {
            _id: user?._id,
            email: user?.email,
            accessToken,
            refreshToken,
          };
        } else {
          throw new Error('Unauthorized');
        }
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      throw new Error('Unauthorized');
    }
  };

  verifyToken = (accessToken: string) => {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  };
}
