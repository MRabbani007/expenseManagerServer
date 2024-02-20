const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express();
const userRouter = require("./userRouter");
const transactionRouter = require("./transactionRouter");

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
router.use(verifyJWT);
router.use("/transaction", transactionRouter);

module.exports = router;
