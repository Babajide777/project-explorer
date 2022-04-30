const router = require("express").Router();
const passport = require("passport");
const { googleAuthentication } = require("../controllers/socialController");

//social routes
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/login/failed" }),
  googleAuthentication
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login/failed",
  }),
  googleAuthentication
);

//route for unsuceesful social media login attempt
router.get("/auth/login/failed", (req, res) => {
  return res.redirect(`http://localhost:3000/failedlogin`);
});

module.exports = router;
