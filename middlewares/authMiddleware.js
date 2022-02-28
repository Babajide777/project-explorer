const { checkJwt } = require("../services/userService");
const { responseHandler } = require("../utils/responseHandler");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader.split('"')[1];

  if (token !== undefined) {
    const check = await checkJwt(token);
    const { id, exp, err } = check;
    if (err) {
      return responseHandler(res, [err], 403, false, "");
    }

    if (id && exp < Date.now()) {
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
