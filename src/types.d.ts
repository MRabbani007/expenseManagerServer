import { Request, RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";

export type User = {
  // Account
  id: string;
  username: string;
  password: string;
  roles: {
    User?: number;
    Editor?: number;
    Admin?: number;
  };
  accessToken?: string;
  refreshToken?: string;

  // Profile
  email?: string;
  firstname?: string;
  lastname?: string;

  // Settings
  theme: string;
  descriptions: [{ type: Object; required: false }];

  active: boolean;
  lastSigin: { type: Date; required: false };

  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  userID: string;
  type: string;
  category: string;
  description: string;
  date: Date;
  paymethod: string;
  amount: number;
  currency: string;

  createdAt: Date;
  updatedAt: Date;
};

type Credentials = { username: string; roles: number[] };

export interface TypedRequest extends Request {
  user: Credentials;
}

export interface TypedJWTPayload extends JwtPayload {
  UserInfo: Credentials;
}

interface RequestHandler<T> extends RequestHandler {
  (req: TypedRequest, res: Response): void;
}
