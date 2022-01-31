const User = require("../models/userModel");

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
const getByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    user.profilePicture = scaledPicture(user.profilePicture);
  }
  return user;
};

const scaledPicture = (pic) => {
  return pic.replace("/upload", "/upload/c_scale,h_50,q_auto:best,w_50");
};

module.exports = {
  authenticateUser,
};
