import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// req: Request & { headers: { authorization: string } } & {
//   user: { username: string; roles: number[] };
// },
// res: Response,
// next: NextFunction

export default function verifyJWT(req, res, next) {
  if (!process.env?.ACCESS_TOKEN_SECRET) {
    return res.sendStatus(500);
  }

  const authHeader = req.headers?.authorization; // || req.headers?.Authorization;

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

    const cred = decoded;

    req.user = {
      username: cred?.username ?? "",
      roles: cred?.roles ?? [],
    };

    next();
  });
}
