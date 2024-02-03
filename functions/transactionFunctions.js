const Transaction = require("../db_schemas/transaction");
const { getDate, ACTIONS } = require("./utils");

const handleTransactions = (userID, { type, payload }) => {
  try {
    switch (type) {
      case ACTIONS.GET_TRANSACTION: {
        let data = Transaction.find({
          userID: userID,
          date: {
            $gte: new Date(payload.startDate),
            $lte: new Date(payload.endDate),
          },
        });
        if (!!data) {
          return data;
        } else {
          return [];
        }
      }
      case ACTIONS.ADD_TRANSACTION: {
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
        const newTransaction = new Transaction({
          id: id,
          userID: userID,
          type: type,
          category: category,
          description: description,
          date: new Date(date),
          paymethod: paymethod,
          amount: amount,
          currency: currency,
        });
        newTransaction.save();
        return "success";
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
        Transaction.updateOne(
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
        return "success";
      }
      case ACTIONS.REMOVE_TRANSACTION: {
        Transaction.deleteOne({
          userID: userID,
          id: payload.transactionId,
        }).exec();
        return "success";
      }
      default: {
      }
    }
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

module.exports = {
  handleTransactions,
};
