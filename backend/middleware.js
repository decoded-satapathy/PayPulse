const jwt = require("jsonwebtoken")
const { JWT_KEY } = require("./config.js")
function auth(req, res, next) {

  let authHeaders = req.headers.authorization;

  authHeaders = authHeaders.split(" ");

  if (!(authHeaders[0] == "Bearer" && authHeaders.length != 0)) {
    res.status(403).json({
      msg: "1. You aren't authenticated"
    })
  }

  const checkedToken = jwt.verify(authHeaders[1], JWT_KEY,
    //TODO - Learn this syntax of .verify with the extra function which takes err and decoded as parameters
    function(err, decoded) {
      if (err) {
        res.status(403).json({
          msg: "Token isn't correct"
        })
      }
      if (!decoded.user_ID) {
        res.status(403).json({
          msg: "2. You aren't authenticated"
        })
      }

      req.userId = decoded.user_ID;
      next();

    }
  );
  //console.log("token : " + checkedToken.user_ID + "\n");

}

module.exports = {
  auth
}
