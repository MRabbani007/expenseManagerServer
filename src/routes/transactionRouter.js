import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  getIncomeAndSpending,
  getTransactions,
} from "../controllers/transactionControllers.js";

const transactionRouter = Router();

transactionRouter
  .route("/user")
  .get(getTransactions)
  .post(addTransaction)
  .patch(editTransaction)
  .delete(deleteTransaction);

transactionRouter.route("/summary").get(getIncomeAndSpending);

export default transactionRouter;
