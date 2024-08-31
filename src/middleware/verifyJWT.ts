import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction, RequestHandler, Response } from "express";
import { Credentials, TypedRequest } from "../types";

dotenv.config();

export default function verifyJWT(
  req: Request & { authorization: string },
  res: Response,
  next: NextFunction
) {
  if (!process.env?.ACCESS_TOKEN_SECRET) return res.sendStatus(500);

  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (!authHeader) return res.sendStatus(401);

  if (typeof authHeader === "string" && !authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401); // unauthorized
  }
  // console.log(authHeader);
  const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : "";

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error || !decoded) {
      return res.sendStatus(403); // forbiden: invalid Token
    }

    const cred = decoded as Credentials;

    req.user = {
      username: cred?.username ?? "",
      roles: cred?.roles ?? "",
    };

    next();
  });
}
