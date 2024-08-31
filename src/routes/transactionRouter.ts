import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  getTransactions,
} from "../controllers/transactionControllers";

const transactionRouter = Router();

transactionRouter
  .route("/user")
  .get(getTransactions)
  .post(addTransaction)
  .patch(editTransaction)
  .delete(deleteTransaction);

export default transactionRouter;
