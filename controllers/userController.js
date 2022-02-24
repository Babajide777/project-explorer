const {
  createUser,
  getByEmail,
  validatePassword,
  signJwt,
  checkJwt,
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
  const anyUsername = await getByEmail(req.body.email);
  if (!anyUsername) {
    return responseHandler(
      res,
      ["Email or Password is incorrect"],
      400,
      false,
      ""
    );
  }
  return (await validatePassword(req.body.password, anyUsername.password))
    ? responseHandler(
        res,
        ["Login Successful"],
        200,
        true,
        signJwt(anyUsername._id)
      )
    : responseHandler(res, ["Email or Password is incorrect"], 400, false, "");
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

const userJwt = async (req, res) => {
  const { token } = req.body;
  const check = await checkJwt(token);
  console.log(check);
};

module.exports = { userLogin, userSignup, userJwt };
