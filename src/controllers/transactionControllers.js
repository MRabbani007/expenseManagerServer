import Transaction from "../db_schemas/transaction.js";
import { getUserID } from "./userControllers.js";

export const getTransactions = async (req, res) => {
  try {
    const username = req?.user?.username;

    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const startDate = req?.query?.startDate ?? "";
    const endDate = req?.query?.endDate ?? "";

    let data = await Transaction.find({
      userID: userID,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    if (!data) {
      return res.sendStatus(204);
    } else {
      return res.status(200).json(data);
    }
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

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    let { id, type, category, description, date, paymethod, amount, currency } =
      transaction;

    const data = await Transaction.create({
      userID,
      id,
      type,
      category,
      description,
      date: new Date(date),
      paymethod,
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

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    let { id, type, category, description, date, paymethod, amount, currency } =
      transaction;

    let data = await Transaction.updateOne(
      {
        userID,
        id,
      },
      {
        $set: {
          type,
          category,
          description,
          date,
          paymethod,
          amount,
          currency,
        },
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    const id = action?.payload?.id;

    let data = await Transaction.deleteOne({
      userID: userID,
      id: id,
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};
