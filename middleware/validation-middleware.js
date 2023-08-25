import { body, validationResult } from "express-validator";

// Username Validation
const usernameValidator = [
  body("username").notEmpty().withMessage("Username cannot be blank"),
];

// Password Validation
const passwordAlphanumeric = (value) => {
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    throw new Error("Password must contain both alphabet and number");
  }
  return true;
};

const passwordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password cannot be blank")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(passwordAlphanumeric)
    .withMessage("Password must be alphanumeric"),
];

// Role Validation
const roleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role cannot be blank")
    .isIn(["maker", "approver"])
    .withMessage("Role must be either 'maker' or 'approver'"),
];

// Validator
export const validator = [
  ...usernameValidator,
  ...passwordValidator,
  ...roleValidator,
];

// Validation Middleware
export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
