const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { translateError } = require("./mongo_helper");

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
      return [true, signJwt(newUser), newUser];
    }
  } catch (err) {
    return [false, translateError(err)];
  }
};

// Authenticate a user
const authenticateUser = async (email, password) => {
  const user = new User();
  user.email = email;
  user.password = password;
  const result = await getByEmail(email);

  return result && user.validPassword(result, user.password)
    ? [true, result]
    : [false, ["Invalid email/password"]];
};

// Return user with specified email
const getByEmail = async (email) => await User.findOne({ email });

// if (user) {
//     user.profilePicture = scaledPicture(user.profilePicture);
//   }

// const scaledPicture = (pic) => {
//   return pic.replace("/upload", "/upload/c_scale,h_50,q_auto:best,w_50");
// };

module.exports = {
  authenticateUser,
  createUser,
  getByEmail,
};
