const User = require("../models/userModel");
const { translateError } = require("./mongo_helper");

const create = async ({
  firstname,
  lastname,
  email,
  password,
  matricNumber,
  program,
  graduationYear,
}) => {
  try {
    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.matricNumber = matricNumber;
    user.program = program;
    user.graduationYear = graduationYear;
    user.setPassword(password);

    if (await user.save()) {
      return [true, user];
    }
  } catch (e) {
    return [false, translateError(e)];
  }
};

/* Authenticate a user */
const authenticate = async (email, password) => {
  const user = new User();
  user.email = email;
  user.password = password;
  const result = await getByEmail(email);

  return result && user.validPassword(result, user.password)
    ? [true, result]
    : [false, ["Invalid email/password"]];
};

/* Return user with specified id */
const getById = async (id) => {
  return await User.findById(id);
};

/* Return all users */
const getAll = async () => {
  return await User.find();
};

/* Return user with specified email */
const getByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (user) {
    user.profilePicture = scaledPicture(user.profilePicture);
  }

  return user;
};

/* update user password with specified id */
const updatePassword = async (id, password) => {
  User.findById(id).exec(function (err, user) {
    if (err) {
      console.log(err);
    }
    user.setPassword(password);
    user.save();
    return true;
  });
};

/* update a user's profile */
const updateProfile = async (field) => {
  return await User.findOneAndUpdate({ email: field.email }, field, {
    new: true,
  });
};

// To get current url
const getUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://jide-explorer.herokuapp.com/"
    : "http://localhost:4000/";
};

// Function to scale picture
const scaledPicture = (pic) => {
  return pic.replace("/upload", "/upload/c_scale,h_50,q_auto:best,w_50");
};

module.exports = {
  create,
  authenticate,
  getById,
  getAll,
  getByEmail,
  updatePassword,
  updateProfile,
  getUrl,
  scaledPicture,
};
