import { MongoClient } from "mongodb";

export const databaseMiddleware = async (req, res, next) => {
  const mongoClient = await new MongoClient(
    "mongodb+srv://root:root@cluster0.ddfbhoi.mongodb.net/?retryWrites=true&w=majority"
  ).connect();
  const db = mongoClient.db("Cluster0");

  req.db = db;

  next();
};
