const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userJwt,
} = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/jwt", userJwt);
module.exports = router;
