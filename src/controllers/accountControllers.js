import Account from "../db_schemas/account.js";
import { getUserID } from "./userControllers.js";

export const getAccounts = async (req, res) => {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const data = await Account.find({ userID });

    const count = await Account.countDocuments({ userID });

    return res.status(200).json({ data, count });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const createAccount = async (req, res) => {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const account = req?.body?.account;
    if (!account) return res.sendStatus(400);

    let {
      type,
      name,
      currency,
      color,
      icon,
      imageUrl,
      bank,
      nameOnCard,
      expDate,
      accountType,
    } = account;

    const data = await Account.create({
      id: crypto.randomUUID(),
      userID,
      type,
      name,
      currency,
      color,
      icon,
      imageUrl,
      bank,
      nameOnCard,
      expDate,
      accountType,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const editAccount = async (req, res) => {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const account = req?.body?.account;
    if (!account) return res.sendStatus(400);

    let {
      id,
      type,
      name,
      currency,
      color,
      icon,
      imageUrl,
      bank,
      nameOnCard,
      expDate,
      accountType,
    } = account;

    let data = await Account.updateOne(
      {
        id,
        userID,
      },
      {
        $set: {
          type,
          name,
          currency,
          color,
          icon,
          imageUrl,
          bank,
          nameOnCard,
          expDate,
          accountType,
        },
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const username = req?.user?.username;
    if (!username) return res.sendStatus(400);

    let userID = await getUserID(username);
    if (!userID) return res.sendStatus(401);

    const id = req?.body?.id;
    if (!id) return res.sendStatus(400);

    let data = await Account.deleteOne({
      id,
      userID,
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};
