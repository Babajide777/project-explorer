const {
  authenticateUser,
  createUser,
  getByEmail,
} = require("../services/userService");
const {
  userRegisterValidation,
  userLoginValidation,
} = require("../services/validation");
const { responseHandler } = require("../utils/responseHandler");

const userLogin = async (req, res) => {
  const { details } = await userLoginValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }

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
  const { details } = await userRegisterValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const anyUsername = await getByEmail(req.body.email);

  if (anyUsername) {
    return responseHandler(res, ["Email already taken"], 400, false, "");
  }
  const check = await createUser(req.body);
  return check[0]
    ? responseHandler(
        res,
        ["User registered successfully"],
        201,
        true,
        check[1]
      )
    : responseHandler(res, ["Unable to register User"], 400, false, check[1]);
};

module.exports = { userLogin, userSignup };
