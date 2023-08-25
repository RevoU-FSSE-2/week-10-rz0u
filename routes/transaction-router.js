import { Router } from "express";
import {
  getAllTransactions,
  createTransaction,
  approveTransactions,
} from "../controller/transaction-controller.js";
import { authorizationMiddleware } from "../middleware/authorization-middleware.js";
import { authenticationMiddleware } from "../middleware/authentication-middleware.js";

export const transactionRouter = Router();

transactionRouter.get("/", getAllTransactions);
transactionRouter.post("/", authenticationMiddleware, createTransaction);
transactionRouter.post(
  "/approve",
  authorizationMiddleware,
  approveTransactions
);
