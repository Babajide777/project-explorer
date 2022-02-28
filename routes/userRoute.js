const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
module.exports = router;
