import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import userRouter from "./userRouter";
import transactionRouter from "./transactionRouter";

const router = Router();

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
router.use(verifyJWT);

router.use("/transaction", transactionRouter);

export default router;
