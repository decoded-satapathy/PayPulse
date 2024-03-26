const { userInfoCheck, userInfoType } = require("../types");
const { User } = require("../db.js");
function signupCheck(req, res, next) {
  const inputBody = req.body;
  const parsedBody = userInfoType.safeParse(inputBody);

  if (parsedBody.success) {
    User.findOne({
      username: inputBody.username
    }).then((req) => {
      console.log(req);
      if (req) {
        res.status(411).json({
          msg: "Email account is taken"
        })
      } else {
        next();
      }
    })


  } else {
    res.status(411).json({
      msg: "Wrong Input"
    })
  }

}



module.exports = {
  signupCheck,
}
