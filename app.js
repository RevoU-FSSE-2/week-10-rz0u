import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { userRouter } from "./routes/user-router.js";
import { transactionRouter } from "./routes/transaction-router.js";
import { databaseMiddleware } from "./middleware/database-middleware.js";
import { authenticationMiddleware } from "./middleware/authentication-middleware.js";
import fs from "fs";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";

const openApiPath = "./doc/openapi.yaml";
const file = fs.readFileSync(openApiPath, "utf-8");
const swaggerDocument = yaml.parse(file);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(databaseMiddleware);

// Import Router
app.use("/users", userRouter);
app.use("/transactions", authenticationMiddleware, transactionRouter);

// App Listen
app.get("/", (req, res) => {
  res.send("RevoU Intermediate Assignment Week 10!");
});

app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});
