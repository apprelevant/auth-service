import { AuthenticatedUser } from './models/AuthenticatedUser';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      NODE_ENV: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY: string;
      ACCESS_TOKEN_ISSUER: string;
      REFRESH_TOKEN_EXPIRY: string;
    }
  }
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// ensures that the file is treated like a module
export {};
