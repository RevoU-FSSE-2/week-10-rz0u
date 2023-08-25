import jwt from "jsonwebtoken";
import { JWT_SIGN } from "../config/jwt.js";

export const authorizationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Access Denied" });
  } else {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, JWT_SIGN);
      if (decodedToken.role === "approver") {
        next();
      } else {
        res.status(401).json({ error: "Access Denied" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
