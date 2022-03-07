const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
router.post("/resetpassword", userResetPassword);
router.get("/profiledetails/:id", userProfileDetails);
module.exports = router;
