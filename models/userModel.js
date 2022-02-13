const mongoose = require("mongoose");
const { Schema } = mongoose;
// const crypto = require("crypto");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    program: String,
    matricNumber: { type: String, required: true },
    graduationYear: Number,
    // salt: { type: String, required: true },
    // profilePicture: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/dz5royvfu/image/upload/c_scale,h_50,q_auto:best,w_50/v1621980671/Explorer/vwydtja2jkmzfvfcd6s2.png",
    // },
  },
  { timestamps: true }
);

// UserSchema.methods.setPassword = function (password) {
//   if (password.length >= 7) {
//     this.salt = crypto.randomBytes(16).toString("hex");
//     this.password = crypto
//       .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
//       .toString("hex");
//   } else {
//     throw new Error("Password should have at least 7 characters");
//   }
// };

// UserSchema.methods.validPassword = function (result, password) {
//   return (
//     result.password ===
//     crypto.pbkdf2Sync(password, result.salt, 1000, 64, "sha512").toString("hex")
//   );
// };
// UserSchema.virtual("thumbnail").get(function () {
//   return this.profilePicture.replace(
//     "/upload",
//     "/upload/c_scale,q_auto:best,w_50"
//   );
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
