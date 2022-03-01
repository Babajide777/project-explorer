const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
router.post("/resetpassword", userResetPassword);
module.exports = router;
