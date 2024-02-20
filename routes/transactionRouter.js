const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const { handleTransactions } = require("../controllers/contentControllers");
const transactionRouter = express();

transactionRouter.route("/get").post(verifyRoles(2001), handleTransactions);

transactionRouter.post("/add", handleTransactions);
transactionRouter.post("/edit", handleTransactions);
transactionRouter.post("/remove", handleTransactions);

module.exports = transactionRouter;
