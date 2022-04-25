const { checkJwt } = require("../services/userService");
const { responseHandler } = require("../utils/responseHandler");

//middlware to verify a user token
const verifyToken = async (req, res, next) => {
  //get token from authorization header
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader.split('"')[1];

  //check if token is undefined
  if (token !== undefined) {
    //check if token exist
    const check = await checkJwt(token);
    const { id, exp, err } = check;
    if (err) {
      return responseHandler(res, [err], 403, false, "");
    }

    //check if token has expired
    if (id && exp < Date.now()) {
      //set id in request
      req.id = id;
      next();
      return;
    } else {
      return responseHandler(res, ["Expired token"], 403, false, "");
    }
  }
  return responseHandler(res, ["No authorization token found"], 403, false, "");
};

module.exports = {
  verifyToken,
};
