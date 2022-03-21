const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
  userProfileChangePwd,
  userContinueSignup,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
router.put("/resetpassword", userResetPassword);
router.get("/profiledetails/:id", userProfileDetails);
router.put("/profilechangepwd", userProfileChangePwd);
router.post("/continuesignup", userContinueSignup);
module.exports = router;
