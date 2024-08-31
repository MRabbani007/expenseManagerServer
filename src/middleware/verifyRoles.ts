import { Request, Response, NextFunction } from "express";
import { TypedRequest } from "../types";

export default function verifyRoles(...allowedRoles: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.user?.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];
    const result = req?.user?.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);

    next();
  };
}
