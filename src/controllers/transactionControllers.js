import Transaction from "../db_schemas/transaction.js";
import { getUserID } from "./userControllers.js";

export const getTransactions = async (req, res) => {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const type = req?.query?.type ?? "latest";
    const page = +req?.query?.page ?? 1;
    const ipp = req?.query?.ipp ?? 20;

    const startDate = req?.query?.startDate ?? "";
    const endDate = req?.query?.endDate ?? "";

    const filters = { userID };

    if (type === "latest") {
    } else if (type === "period") {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const data = await Transaction.find(filters)
      .populate({
        path: "accountId",
        select: "name color id", // Populate specific fields
      })
      .populate({
        path: "descId",
        select: "label category icon",
      })
      .limit(ipp)
      .skip(ipp * (+page - 1));

    const count = await Transaction.countDocuments(filters);

    return res.status(200).json({ data, count });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export async function getIncomeAndSpending(req, res) {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const startDate = req?.query?.startDate ?? "";
    const endDate = req?.query?.endDate ?? "";

    const result = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          }, // Filter transactions within date range
          category: { $ne: "Transfer" },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0], // Sum only income amounts
            },
          },
          totalSpending: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0], // Sum only expense amounts
            },
          },
        },
      },
    ]);

    const breakDown = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          }, // Filter by date range
          category: { $ne: "Transfer" },
          // type: "expense", // Only include expense transactions
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          spending: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          count: { $sum: 1 }, // Count transactions per category
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by highest spending
      },
    ]);

    const totals =
      result.length > 0
        ? {
            totalIncome: result[0].totalIncome || 0,
            totalSpending: result[0].totalSpending || 0,
          }
        : { totalIncome: 0, totalSpending: 0 }; // Return 0 if no transactions found

    return res.status(200).json({ totals, breakDown });
  } catch (error) {
    return res.sendStatus(500);
  }
}

export const addTransaction = async (req, res) => {
  try {
    const transaction = req?.body?.transaction;
    if (!transaction) return res.sendStatus(400);

    const username = req?.user?.username;
    const userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const {
      type,
      category,
      description,
      descId,
      details,
      notes,
      date,
      paymethod,
      accountId,
      amount,
      currency,
    } = transaction;

    const data = await Transaction.create({
      userID,
      id: crypto.randomUUID(),
      type,
      category,
      description,
      descId,
      details,
      notes,
      date: new Date(date),
      paymethod,
      accountId,
      amount,
      currency,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const editTransaction = async (req, res) => {
  try {
    const username = req?.user?.username;
    const transaction = req?.body?.transaction;

    if (!transaction) return res.sendStatus(400);

    const userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const {
      id,
      type,
      category,
      description,
      descId,
      details,
      notes,
      date,
      paymethod,
      amount,
      currency,
    } = transaction;

    const data = await Transaction.updateOne(
      {
        userID,
        id,
      },
      {
        $set: {
          type,
          category,
          description,
          descId,
          details,
          notes,
          date,
          paymethod,
          amount,
          currency,
        },
      }
    );

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req?.body?.id;
    const username = req?.user?.username;

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    let data = await Transaction.deleteOne({ userID, id });

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};
