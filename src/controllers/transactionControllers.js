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
      .limit(ipp)
      .skip(ipp * (+page - 1));

    const count = await Transaction.countDocuments(filters);

    return res.status(200).json({ data, count });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const addTransaction = async (req, res) => {
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
      details,
      notes,
      date,
      paymethod,
      amount,
      currency,
    } = transaction;

    const data = await Transaction.create({
      userID,
      id,
      type,
      category,
      description,
      details,
      notes,
      date: new Date(date),
      paymethod,
      amount,
      currency,
    });

    return res.sendStatus(204);
  } catch (error) {
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
