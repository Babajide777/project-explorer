const router = require("express").Router();
const passport = require("passport");

// const {
//   facebookAuthentication,
//   googleAuthentication,
// } = require("../controllers/socialController");

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    req.session.user = req.user;
    req.user.graduationYear === undefined && req.user.program === undefined
      ? res.redirect("/continuesignup")
      : res.redirect("/");
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(req);
    // req.session.user = req.user;
    // req.user.graduationYear === undefined && req.user.program === undefined
    //   ? res.redirect("/continuesignup")
    //   : res.redirect("/");
  }
);
// router.get("/facebook", facebookAuthentication);

// router.get("/google", googleAuthentication);
module.exports = router;