const {
  facebookAuthentication,
  googleAuthentication,
} = require("../controllers/socialController");

const router = require("express").Router();

router.get("/facebook", facebookAuthentication);

router.get("/google", googleAuthentication);
module.exports = router;
