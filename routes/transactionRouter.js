const express = require("express");
const transactionRouter = express();
const { getUserID } = require("../functions/userFunctions");
const { handleTransactions } = require("../functions/transactionFunctions");

transactionRouter.post("/", async (req, res) => {
  res.json("Server Running");
});

transactionRouter.post("/get", async (req, res) => {
  try {
    let action = req.body.action;
    let userName = action.payload.userName;
    let userID = await getUserID(userName);
    console.log("Transaction:", action.type);
    let result = await handleTransactions(userID, action);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json("Error: Fetch Transactions");
  }
});

module.exports = transactionRouter;
