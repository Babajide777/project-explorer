const router = require("express").Router();
const {
  facebookAuthentication,
  googleAuthentication,
} = require("../controllers/socialController");

// router.use(passport.initialize());
// router.use(passport.session());

router.get("/facebook", facebookAuthentication);

router.get("/google", googleAuthentication);
module.exports = router;
