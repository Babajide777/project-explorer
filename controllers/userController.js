const { authenticateUser } = require("../services/userService");
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

module.exports = { userLogin };
