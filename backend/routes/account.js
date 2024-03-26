const express = require("express");
const { auth } = require("../middleware.js")
const router = express.Router();
const { Account } = require("../db.js");
const mongoose = require("mongoose")
router.use(express.json());

router.get("/balance", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    res.status(200).json({
      balance: account.balance
    })
  } catch (err) {
    res.status(411).json({
      msg: "User Doesn't exists, kindly sign up"
    })
  }

})


router.post("/transfer", auth, async (req, res) => {
  if (req.body.amount <= 0) {
    return res.status(400).json({
      msg: "Transfer amount is incorrect (either negative or zero)"
    })
  }


  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //The .session(session) method at the end of your statement is used to associate the Mongoose query with a specific session.
    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (fromAccount.balance < req.body.amount) {
      await session.abortTransaction();
      return res.status(400).json({
        raw_Msg: "Aukaat mai bhenchod, aukaat mai",
        msg: "Account funds is less than the transfer amount",
      })
    }
    // .session(<sessionObj>) makes sure that this operation is associated with the session only
    const toAccount = await Account.findOne({ userId: req.body.to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: "The to account doesn't exists"
      })
    } else {
      // updating the from account
      await Account.findByIdAndUpdate(fromAccount._id, { $inc: { balance: - req.body.amount } },).session(session);
      // updating the to account
      await Account.findByIdAndUpdate(toAccount._id, { $inc: { balance: req.body.amount } },).session(session);
      // commiting the changes to the databases
      await session.commitTransaction();
      return res.status(200).json({
        msg: "Money was transffered successfully"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(411).json({
      msg: "User Doesn't exists, kindly sign up"
    })
  }
})


// router.post("/transfer", auth, async (req, res) => {
//   const session = await mongoose.startSession();
//
//   session.startTransaction();
//   const { amount, to } = req.body;
//
//   // Fetch the accounts within the transaction
//   const account = await Account.findOne({ userId: req.userId }).session(session);
//
//   if (!account || account.balance < amount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Insufficient balance"
//     });
//   }
//
//   const toAccount = await Account.findOne({ userId: to }).session(session);
//
//   if (!toAccount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Invalid account"
//     });
//   }
//
//   // Perform the transfer
//   await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//   await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
//
//   // Commit the transaction
//   await session.commitTransaction();
//   res.json({
//     message: "Transfer successful"
//   });
// });
module.exports = router;

