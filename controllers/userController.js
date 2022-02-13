const { authenticateUser } = require("../services/userService");
const { userRegisterValidation } = require("../services/validation");
const { responseHandler } = require("../utils/responseHandler");

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const check = await authenticateUser(email, password);
  return check[0]
    ? responseHandler(
        res,
        "User authentication succesful",
        200,
        check[0],
        check[1]
      )
    : responseHandler(
        res,
        "User authentication not succesful",
        401,
        check[0],
        check[1]
      );
};

const userSignup = async (req, res) => {
  console.log(req.body);
  const { details } = await userRegisterValidation(req.body);
  console.log(details);
};

module.exports = { userLogin, userSignup };
