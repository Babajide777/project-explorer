const {
  createUser,
  getByEmail,
  validatePassword,
  signJwt,
  getUserByID,
  hashedPassword,
  getUserByIDandUpdatePassword,
  checkJwt,
  getUserByIDandUpdateField,
} = require("../services/userService");
const {
  userRegisterValidation,
  userLoginValidation,
  userforgotPasswordValidation,
  userResetPasswordValidation,
  profileChangePasswordValidation,
  updateUserContinueSignupValidation,
  userEditProfileValidation,
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

const userContinueSignup = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader.split('"')[1];

  if (token !== undefined) {
    const check = await checkJwt(token);
    const { id, err } = check;
    if (err) {
      return responseHandler(res, [err], 403, false, "");
    }
    const gottenUser = await getUserByID(id);
    if (gottenUser) {
      return responseHandler(res, "User found", 200, true, gottenUser);
    }
    return responseHandler(res, ["User not found"], 400, false, "");
  }
  return responseHandler(res, ["No authorization token found"], 403, false, "");
};

const updateUserContinueSignup = async (req, res) => {
  const { details } = await updateUserContinueSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { program, graduationYear, matricNumber, id } = req.body;
  let field = {
    program,
    graduationYear,
    matricNumber,
  };
  const check = await getUserByIDandUpdateField(id, field);
  if (check) {
    return responseHandler(res, ["User Signup complete"], 200, true, "");
  }
  return responseHandler(res, ["Unable to complete signup"], 404, false, "");
};

const userProfileUpdate = async (req, res) => {
  const { details } = await userEditProfileValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const {
    firstName,
    lastName,
    email,
    program,
    matricNumber,
    graduationYear,
    id,
  } = req.body;

  let field = {
    firstName,
    lastName,
    email,
    program,
    matricNumber,
    graduationYear,
  };
  const updatedUser = await getUserByIDandUpdateField(id, field);
  let updatedProfilePic;

  console.log(req.file);
};

module.exports = {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
  userProfileChangePwd,
  userContinueSignup,
  updateUserContinueSignup,
  userProfileUpdate,
};
