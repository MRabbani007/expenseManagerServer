import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import userRouter from "./userRouter.js";
import transactionRouter from "./transactionRouter.js";
import verifyRoles from "../middleware/verifyRoles.js";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from "../controllers/categoryControllers.js";
import {
  createDescription,
  deleteDescription,
  editDescription,
  getDescriptions,
} from "../controllers/descriptionControllers.js";
import { handleGetUsers } from "../controllers/userControllers.js";
import {
  createAccount,
  deleteAccount,
  editAccount,
  getAccounts,
} from "../controllers/accountControllers.js";

const router = Router();

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
router.use(verifyJWT);

router.use("/transaction", transactionRouter);

router.get("/category", getCategories);
router.get("/description", getDescriptions);

router
  .route("/account")
  .get(getAccounts)
  .post(createAccount)
  .patch(editAccount)
  .delete(deleteAccount);

router.use(verifyRoles(5150));

router
  .route("/category")
  .post(createCategory)
  .patch(editCategory)
  .delete(deleteCategory);

router
  .route("/description")
  .post(createDescription)
  .patch(editDescription)
  .delete(deleteDescription);

router.route("/admin/users").get(handleGetUsers);

export default router;
