import { Router, RequestHandler } from "express";
import verifyRoles from "../middleware/verifyRoles";
import {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleRefreshToken,
} from "../controllers/userControllers";

const userRouter = Router();

// Signup Request
userRouter.post("/register", handleSignUp);

// Signin Request
userRouter.post("/auth", handleSignIn);

// Signout Request
userRouter.post("/logout", handleSignOut);

// Refresh Access Token
userRouter.get("/refresh", handleRefreshToken);

// userRouter.route("/admin").post(verifyRoles(5150), handleGetUsers);

// userRouter
//   .route("/settings")
//   .post(verifyRoles(2001), handleUserGetSettings)
//   .put(verifyRoles(2001), handleUserEditSettings);

// userRouter
//   .route("/descriptions")
//   .post(verifyRoles(2001), handleUserDescriptions)
//   .put(verifyRoles(2001), handleUserDescriptions);

// userRouter.route("/pwd").post(verifyRoles(2001), handleUserPassword);

userRouter.post("/*", (req, res) => {
  res.json("Server Running");
});

export default userRouter;
