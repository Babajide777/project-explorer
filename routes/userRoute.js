const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
  userProfileChangePwd,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
router.post("/resetpassword", userResetPassword);
router.get("/profiledetails/:id", userProfileDetails);
router.post("/profilechangepwd", userProfileChangePwd);
module.exports = router;
