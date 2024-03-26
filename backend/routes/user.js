const express = require("express");
const { signupCheck, signInCheck } = require("../middlewares/middlewares");
const { JWT_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db")
const zod = require("zod");
const { auth } = require("../middleware.js");
const { userInfoType } = require("../types.js");

const router = express.Router();

router.post("/signup", signupCheck, async (req, res) => {


  const user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  })
  const user_ID = user._id;
  const generated_jwt = jwt.sign({ user_ID }, JWT_KEY);
  const user_account = await Account.create({
    userId: user_ID,
    balance: Math.floor(Math.random() * 9999 + 1)
  })
  res.status(200).json({
    message: "User created successfully",
    token: generated_jwt,
    userInfo: {
      personalDetails: user,
      accountDetails: user_account
    }
  })

});

router.post("/signin", async (req, res) => {
  const inputBody = req.body;

  const signInType = zod.object({
    username: zod.string().email(),
    password: zod.string()
  })

  const parsedBody = signInType.safeParse(inputBody);
  if (parsedBody.success) {
    console.log("After parsing success ")
    const response = await User.findOne({ username: inputBody.username })

    const user_account = await Account.findOne({ userId: response._id })
    if (response) {
      const user_ID = response._id;
      const generated_jwt = jwt.sign({ user_ID }, JWT_KEY);
      res.status(200).json({
        msg: "You are signed in",
        token: generated_jwt,
        userInfo: {
          personalDetails: response,
          accountDetails: user_account
        }
      })
    } else {
      res.status(411).json({
        msg: "Error while signing in"
      })
    }


  } else {
    res.status(411).json({
      msg: "Wrong Input"
    })
  }
})


router.get("/userinfo", auth, async (req, res) => {
  if (!req.userId) res.status(400).json({ msg: "Something went wrong" })
  const userid = req.userId;

  const userinfo = await User.findOne({ _id: userid });
  const accountInfo = await Account.findOne({ userId: userid });

  res.status(200).json({
    userinfo: userinfo,
    accountinfo: accountInfo,

  })
})

router.put("/", auth, (req, res) => {
  const inputBody = req.body;
  const updateInputType = zod.object({
    password: zod.string().min(6).optional(), // this optional thing makes it so that this input is optional for the user to enter
    firstName: zod.string().min(2).optional(),
    lastName: zod.string().min(2).optional(),
  })

  const parsedInput = updateInputType.safeParse(inputBody);
  if (parsedInput.success) {
    User.findByIdAndUpdate(
      req.userId,
      { firstName: inputBody.firstName, lastName: inputBody.lastName, password: inputBody.password })
      .then(() => {
        res.status(200).json({
          msg: "Details has been updated successfully"
        })
      })
  } else {
    res.status(411).json({
      msg: "Error while updating info"
    })
  }
})

router.get("/bulk", async (req, res) => {
  const filterName = req.query.filter || ""; // this || operator to set the default value of the filter
  let filteredUsers = [];
  // simple solution
  // const usersFound = await User.find({ firstName: filterName })

  //Elegant solution
  const usersFound = await User.find({
    $or: [{ // this or is like firstName like filter or lastName like filter
      firstName: {
        "$regex": filterName
      }
    }, {
      lastName: {
        "$regex": filterName
      }
    }]
  })

  usersFound.map(item => {
    const userObj = { firstName: item.firstName, lastName: item.lastName, _id: item._id };
    filteredUsers.push(userObj);
  })
  res.json({
    users: filteredUsers
  })

})

module.exports = router;
