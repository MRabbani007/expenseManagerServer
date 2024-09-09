import { Router } from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleRefreshToken,
  handleGetDescriptions,
  handleSetDescriptions,
} from "../controllers/userControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";

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

userRouter
  .route("/descriptions")
  .get(verifyJWT, verifyRoles(2001), handleGetDescriptions)
  .patch(verifyJWT, verifyRoles(2001), handleSetDescriptions);

// userRouter
//   .route("/descriptions")
//   .post(verifyRoles(2001), handleUserDescriptions)
//   .put(verifyRoles(2001), handleUserDescriptions);

// userRouter.route("/pwd").post(verifyRoles(2001), handleUserPassword);

userRouter.post("/*", (req, res) => {
  res.json("Server Running");
});

export default userRouter;
