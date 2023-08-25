import { Router } from "express";
import { register, login } from "../controller/user-controller.js";
import { body } from "express-validator";
import {
  validateInput,
  validator,
} from "../middleware/validation-middleware.js";

export const userRouter = Router();

userRouter.post(
  "/register",
  validator,
  validateInput,
  body("username").trim(),
  register
);
userRouter.post("/login", login);
