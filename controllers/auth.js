const express = require("express");
const User = require("../models/userModel");
const passport = require("passport");
const { getByEmail, getUrl } = require("../services/user");

const facebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// FaceBook Authentication
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new facebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${getUrl()}facebook/callback`,
      profileFields: ["email", "id", "first_name", "last_name"],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        const { email, id, first_name, last_name } = profile._json;
        getByEmail(email)
          .then((person) => {
            if (person) {
              return done(null, person);
            } else {
              let newUser = new User();
              newUser.firstname = first_name;
              newUser.lastname = last_name;
              newUser.email = email;
              newUser.matricNumber = id;
              newUser.setPassword(id);
              newUser
                .save()
                .then((res) => {
                  done(null, res);
                })
                .catch((err) => {
                  throw err;
                });
            }
          })
          .catch((err) => done(err));
      });
    }
  )
);

passport.serializeUser(function (person, done) {
  done(null, person.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    req.session.user = req.user;
    req.user.graduationYear === undefined && req.user.program === undefined
      ? res.redirect("/continuesignup")
      : res.redirect("/");
  }
);

// Google Authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${getUrl()}auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      const { sub, name, given_name, family_name, email } = profile._json;
      getByEmail(email)
        .then((person) => {
          if (person) {
            return done(null, person);
          } else {
            let newUser = new User();
            newUser.firstname = given_name;
            newUser.lastname = family_name;
            newUser.email = email;
            newUser.matricNumber = sub;
            newUser.setPassword(name);
            newUser
              .save()
              .then((res) => {
                done(null, res);
              })
              .catch((err) => {
                throw err;
              });
          }
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser(function (person, done) {
  done(null, person.sub);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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
    // req.session.user = req.user;
    // req.user.graduationYear === undefined && req.user.program === undefined
    //   ? res.redirect("/continuesignup")
    //   : res.redirect("/");
    console.log(req);
  }
);

module.exports = router;
