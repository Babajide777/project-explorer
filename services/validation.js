const Joi = require("joi");

//User registration validation rules
const userRegisterValidation = async (field) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().required(),
    lastName: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(1024),
    program: Joi.string()
      .valid(
        "Computer Science",
        "Computer Information Systems",
        "Computer technology"
      )
      .required(),
    matricNumber: Joi.string().alphanum().required(),
    graduationYear: Joi.number()
      .valid(2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022)
      .required(),
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//User login validation rules
const userLoginValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required().min(8).max(1024),
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

// User forgot password validation rules
const userforgotPasswordValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

// User reset password validation rules
const userResetPasswordValidation = async (field) => {
  const schema = Joi.object({
    password: Joi.string().required().min(8).max(1024),
    confirmPassword: Joi.string().required().min(8).max(1024),
    id: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

// create project validation rules
const createProjectValidation = async (field) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    abstract: Joi.string().required(),
    authors: Joi.array().min(0).items(Joi.string()).required(),
    tags: Joi.array().min(0).items(Joi.string()).required(),
    createdBy: Joi.string().alphanum(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

// User profile change password validation rules
const profileChangePasswordValidation = async (field) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().min(8).max(1024),
    newPassword: Joi.string().required().min(8).max(1024),
    confirmPassword: Joi.string().required().min(8).max(1024),
    id: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

// continue signup validation rules
const updateUserContinueSignupValidation = async (field) => {
  const schema = Joi.object({
    program: Joi.string()
      .valid(
        "Computer Science",
        "Computer Information Systems",
        "Computer technology"
      )
      .required(),
    graduationYear: Joi.number()
      .valid(2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022)
      .required(),
    matricNumber: Joi.string().alphanum().required(),
    id: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  userforgotPasswordValidation,
  userResetPasswordValidation,
  createProjectValidation,
  profileChangePasswordValidation,
  updateUserContinueSignupValidation,
};
