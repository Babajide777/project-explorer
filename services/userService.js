const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { translateError } = require("./mongo_helper");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken");

//To hash pasword
const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

// create user
const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  program,
  matricNumber,
  graduationYear,
}) => {
  try {
    let newUser = new User({
      firstName,
      lastName,
      email,
      password: await hashedPassword(password),
      program,
      matricNumber,
      graduationYear,
    });
    if (await newUser.save()) {
      return [true, signJwt(newUser._id), newUser];
    }
  } catch (err) {
    return [false, translateError(err)];
  }
};

// Return user with specified email
const getByEmail = async (email) => await User.findOne({ email });

// create and sign json web token for a user
const signJwt = (id) => {
  const token = jwt.sign({ id }, TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  const data = {};
  data.token = token;
  return { token: data.token };
};

//To validate user password
const validatePassword = async (formPassword, dbPassword) =>
  await bcrypt.compare(formPassword, dbPassword);

//To verify user's Jwt
const checkJwt = async (jwtID) => {
  try {
    return await jwt.verify(jwtID, TOKEN_SECRET);
  } catch (error) {
    return { err: error.message };
  }
};

// if (user) {
//     user.profilePicture = scaledPicture(user.profilePicture);
//   }

// const scaledPicture = (pic) => {
//   return pic.replace("/upload", "/upload/c_scale,h_50,q_auto:best,w_50");
// };

module.exports = {
  createUser,
  getByEmail,
  validatePassword,
  signJwt,
  checkJwt,
};
