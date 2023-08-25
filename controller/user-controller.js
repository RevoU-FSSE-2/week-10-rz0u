import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SIGN } from "../config/jwt.js";
import { StandardError } from "../utils/standard-error.js";

// Register New User Controller
const registerService = async (req, username, role, password) => {
  const user = await req.db.collection("users").findOne({ username });

  if (user) {
    throw new Error("Username taken");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await req.db
    .collection("users")
    .insertOne({ username, role, password: hashedPassword });

  return newUser;
};
export const register = async (req, res, next) => {
  const { username, role, password } = req.body;

  try {
    const newUser = await registerService(req, username, role, password);

    res.status(201).json({
      message: "User successfully registered",
      data: newUser,
    });
  } catch (error) {
    const standardError = new StandardError({
      message: error.message || "Failed registering new user",
      status: 500,
    });
    next(standardError);
  }
};

// Login Existing User
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await req.db.collection("users").findOne({ username });
  if (!user) {
    return res.status(400).json({
      Message: "Username doesnt exist",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (isPasswordCorrect) {
    const token = jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      JWT_SIGN
    );
    res.status(200).json({
      message: "Logged in successfully",
      data: token,
    });
  } else {
    res.status(400).json({ error: "Incorrect password" });
  }
};
