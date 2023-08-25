// Get All Transactions
import { ObjectId } from "mongodb";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await req.db
      .collection("transactions")
      .find()
      .toArray();

    res.status(200).json({
      message: "Retrieving transactions successful",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Transactions
export const createTransaction = async (req, res) => {
  const { amount, currency, sourceAccount, destinationAccount } = req.body;
  const status = "pending";
  try {
    const newTransaction = await req.db.collection("transactions").insertOne({
      amount,
      currency,
      sourceAccount,
      destinationAccount,
      status,
    });

    res.status(201).json({
      message: "Transaction is waiting for approval",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve Transactions
export const approveTransactions = async (req, res) => {
  const { role } = req.user;
  if (role !== "approver") {
    return res.status(403).json({
      message: "User is not a an approver",
    });
  }

  const { transferId, status } = req.body;

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({
      message: "Status invalid",
    });
  }

  try {
    const result = await req.db
      .collection("transfer")
      .updateOne({ _id: new ObjectId(transferId) }, { $set: { status } });
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: "Transfer does not exist",
      });
    }
    if (status === "approved") {
      res.status(200).json({
        message: "Transfer request approved",
      });
    } else {
      res.status(200).json({
        message: "Transfer request rejected",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
