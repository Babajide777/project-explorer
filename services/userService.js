const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
// const getByEmail = async (email) => {
//   const user = await User.findOne({ email: email });
//   if (user) {
//     user.profilePicture = scaledPicture(user.profilePicture);
//   }
//   return user;
// };

// const scaledPicture = (pic) => {
//   return pic.replace("/upload", "/upload/c_scale,h_50,q_auto:best,w_50");
// };

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
    let newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.password = await hashedPassword(password);
    newUser.program = program;
    newUser.matricNumber = matricNumber;
    newUser.graduationYear = graduationYear;
    if (await newUser.save()) {
      return [true, signJwt(newUser), newUser];
    }
  } catch (err) {
    return [false, translateError(err)];
  }
};
module.exports = {
  authenticateUser,
};
