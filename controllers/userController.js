const {
  createUser,
  getByEmail,
  validatePassword,
  signJwt,
  getUserByID,
  hashedPassword,
  getUserByIDandUpdatePassword,
} = require("../services/userService");
const {
  userRegisterValidation,
  userLoginValidation,
  userforgotPasswordValidation,
  userResetPasswordValidation,
  profileChangePasswordValidation,
} = require("../services/validation");
const { responseHandler } = require("../utils/responseHandler");
const { createMail } = require("../services/sendMail");

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

const userForgotPassword = async (req, res) => {
  const { details } = await userforgotPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { email } = req.body;
  const check = await getByEmail(email);

  if (check) {
    createMail(email, check._id);
    return responseHandler(res, ["Email sent to user"], 200, true, "");
  }
  return responseHandler(
    res,
    ["Email does not belong to a registered user"],
    404,
    false,
    ""
  );
};

const userResetPassword = async (req, res) => {
  const { details } = await userResetPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { password, confirmPassword, id } = req.body;

  if (password !== confirmPassword) {
    return responseHandler(res, ["passwords do not match"], 400, false, "");
  }
  const check = await getUserByID(id);
  if (check) {
    const newPassword = await hashedPassword(password);
    if (getUserByIDandUpdatePassword(id, newPassword)) {
      return responseHandler(
        res,
        ["password sucesssfully changed"],
        200,
        true,
        ""
      );
    }
    return responseHandler(res, ["Error reseting password"], 400, false, "");
  }
  return responseHandler(res, ["incorrect id"], 400, false, "");
};

const userProfileDetails = async (req, res) => {
  const { id } = req.params;
  const user = await getUserByID(id);
  return user
    ? responseHandler(res, "User found", 200, true, user)
    : responseHandler(res, "User not found", 404, false, "");
};

const userProfileChangePwd = async (req, res) => {
  const { details } = await profileChangePasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { currentPassword, newPassword, confirmPassword, id } = req.body;

  if (newPassword !== confirmPassword) {
    return responseHandler(res, ["passwords do not match"], 400, false, "");
  }
  const user = await getUserByID(id);
  if (!user) {
    return responseHandler(res, ["id doesn't exist"], 404, false, "");
  }

  const check = await validatePassword(currentPassword, user.password);

  if (!check) {
    return responseHandler(
      res,
      ["Your current password is incorrect"],
      400,
      false,
      ""
    );
  }

  const changedPassword = await hashedPassword(newPassword);
  if (getUserByIDandUpdatePassword(id, changedPassword)) {
    return responseHandler(
      res,
      ["password sucesssfully changed"],
      200,
      true,
      ""
    );
  }
  return responseHandler(res, ["Error reseting password"], 400, false, "");
};

module.exports = {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
  userProfileChangePwd,
};
