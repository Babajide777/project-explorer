const router = require("express").Router();
const passport = require("passport");
const { googleAuthentication } = require("../controllers/socialController");
const CLIENT_URL = "http://localhost:3000/";
const { responseHandler } = require("../utils/responseHandler");

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
  passport.authenticate("google", {
    failureRedirect: "/auth/login/failed",
  }),
  googleAuthentication
);

router.get("/auth/login/failed", (req, res) => {
  return responseHandler(res, "Login Unsuccessfully", 401, false, "");
});

module.exports = router;
