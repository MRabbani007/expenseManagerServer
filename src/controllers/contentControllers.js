const Transaction = require("../db_schemas/transaction");
const { getUserID } = require("./userControllers");
const { ACTIONS } = require("../data/utils");

const handleTransactions = async (req, res) => {
  try {
    const action = req?.body?.action;
    const userName = action?.payload?.userName;
    const { type, payload } = action;

    let userID = await getUserID(userName);
    if (!userID) return res.sendStatus(401);

    switch (type) {
      case ACTIONS.GET_TRANSACTION: {
      }
      case ACTIONS.ADD_TRANSACTION: {
      }
      case ACTIONS.EDIT_TRANSACTION: {
        let {
          id,
          type,
          category,
          description,
          date,
          paymethod,
          amount,
          currency,
        } = payload.transaction;
        let data = Transaction.updateOne(
          {
            userID: userID,
            id: id,
          },
          {
            $set: {
              type: type,
              category: category,
              description: description,
              date: new Date(date),
              paymethod: paymethod,
              amount: amount,
              currency: currency,
            },
          }
        ).exec();
        return res
          .status(204)
          .json({ status: "success", message: "transaction updated" });
      }
      case ACTIONS.REMOVE_TRANSACTION: {
        let data = Transaction.deleteOne({
          userID: userID,
          id: payload.transactionId,
        }).exec();
        return res
          .status(204)
          .json({ status: "success", message: "transaction removed" });
      }
      default: {
        return res
          .status(204)
          .json({ status: "failed", message: "action not found" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server Error" });
  }
};

module.exports = {
  handleTransactions,
};
