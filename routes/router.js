const express = require("express");
const router = express();

const userRouter = require("./userRouter");
const transactionRouter = require("./transactionRouter");

router.use("/user", userRouter);
router.use("/transaction", transactionRouter);

router.get("/", (req, res) => {
  res.json("Server Running");
});

router.post("/", (req, res) => {
  res.json("Server Running");
});

module.exports = router;
