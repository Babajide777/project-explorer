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
  scaledPicture,
  findUrlAndUpdate,
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

//controller to login user
const userLogin = async (req, res) => {
  //validate req.body
  const { details } = await userLoginValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  //check if email exists
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
  //validate user password
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

//controller to create user
const userSignup = async (req, res) => {
  //validate req.body
  const { details } = await userRegisterValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  //check if email exists
  const anyUsername = await getByEmail(req.body.email);

  if (anyUsername) {
    return responseHandler(res, ["Email already taken"], 400, false, "");
  }
  //create user is email isn't in the database
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

// controller for user's that forgot their
const userForgotPassword = async (req, res) => {
  //validate req.body
  const { details } = await userforgotPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { email } = req.body;
  //check if email exists
  const check = await getByEmail(email);

  if (check) {
    //send email to user if email is in the database
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

//controller to reset password
const userResetPassword = async (req, res) => {
  //validate req.body
  const { details } = await userResetPasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { password, confirmPassword, id } = req.body;
  //check if passwords match
  if (password !== confirmPassword) {
    return responseHandler(res, ["passwords do not match"], 400, false, "");
  }
  //check if user is in the database given the id
  const check = await getUserByID(id);
  if (check) {
    //hash password if user exists
    const newPassword = await hashedPassword(password);

    //update user password
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

//controller to get user details
const userProfileDetails = async (req, res) => {
  const { id } = req.params;
  //check if user is in the database given the id
  const user = await getUserByID(id);
  return user
    ? responseHandler(res, "User found", 200, true, user)
    : responseHandler(res, "User not found", 404, false, "");
};

//controller to change password from user profile
const userProfileChangePwd = async (req, res) => {
  //validate req.body
  const { details } = await profileChangePasswordValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { currentPassword, newPassword, confirmPassword, id } = req.body;

  //check if passwords match
  if (newPassword !== confirmPassword) {
    return responseHandler(res, ["passwords do not match"], 400, false, "");
  }
  //check if user is in the database given the id
  const user = await getUserByID(id);
  if (!user) {
    return responseHandler(res, ["id doesn't exist"], 404, false, "");
  }

  //validate user password
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

  // hash user password
  const changedPassword = await hashedPassword(newPassword);

  //update user's password
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

//controller for user to continue signup
const userContinueSignup = async (req, res) => {
  //check if user is in the database given the id
  const gottenUser = await getUserByID(req.id);
  if (gottenUser) {
    return responseHandler(res, "User found", 200, true, gottenUser);
  }
  return responseHandler(res, ["User not found"], 400, false, "");
};

//controller to update user continue signup
const updateUserContinueSignup = async (req, res) => {
  //validate req.body
  const { details } = await updateUserContinueSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const { program, graduationYear, matricNumber, id } = req.body;

  //create user field
  let field = {
    program,
    graduationYear,
    matricNumber,
  };

  //update user given specific fields
  const check = await getUserByIDandUpdateField(id, field);
  if (check) {
    return responseHandler(res, ["User Signup complete"], 200, true, "");
  }
  return responseHandler(res, ["Unable to complete signup"], 404, false, "");
};

//controller update user profile
const userProfileUpdate = async (req, res) => {
  //validate req.body
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

  //create user field
  let field = {
    firstName,
    lastName,
    email,
    program,
    matricNumber,
    graduationYear,
  };

  //update user given specific fields
  const updatedUser = await getUserByIDandUpdateField(id, field);
  let updatedProfilePic;

  //check if picture was uploaded
  if (req.file !== undefined) {
    //scaled user profile picture
    const profilePicture = scaledPicture(req.file.path);

    //update picture url
    updatedProfilePic = await findUrlAndUpdate(profilePicture, id);
  }

  return updatedUser && updatedProfilePic
    ? responseHandler(
        res,
        ["name and picture updated"],
        200,
        true,
        updatedProfilePic
      )
    : updatedUser
    ? responseHandler(res, ["name updated"], 200, true, updatedUser)
    : updatedProfilePic
    ? responseHandler(res, ["picture updated"], 200, true, updatedProfilePic)
    : responseHandler(
        res,
        ["Error updating name and/or picture"],
        400,
        false,
        ""
      );
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
