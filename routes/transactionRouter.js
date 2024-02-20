const express = require("express");
const { handleTransactions } = require("../controllers/contentControllers");
const transactionRouter = express();

transactionRouter.post("/get", handleTransactions);
transactionRouter.post("/add", handleTransactions);
transactionRouter.post("/edit", handleTransactions);
transactionRouter.post("/remove", handleTransactions);

module.exports = transactionRouter;
