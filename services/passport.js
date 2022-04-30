const User = require("../models/userModel");
const passport = require("passport");
const { getByEmail, getUrl, createUser, signJwt } = require("./userService");
const facebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

//Facebook Authentication
passport.use(
  new facebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: `${getUrl()}auth/facebook/callback`,
      profileFields: ["email", "id", "first_name", "last_name"],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        const { email, id, first_name, last_name } = profile._json;
        getByEmail(email)
          .then((person) => {
            if (person) {
              let signedPerson = signJwt(person._id);
              return done(null, signedPerson);
            } else {
              createUser({
                firstName: first_name,
                lastName: last_name,
                email: email,
                password: sub,
                matricNumber: sub,
              })
                .then((res) => {
                  if (res[0]) {
                    done(null, res[1]);
                  }
                })
                .catch((err) => done(err));
            }
          })
          .catch((err) => done(err));
      });
    }
  )
);

// Google Authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${getUrl()}auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const { sub, given_name, family_name, email } = profile._json;
      getByEmail(email)
        .then((person) => {
          if (person) {
            let signedPerson = signJwt(person._id);
            return done(null, signedPerson);
          } else {
            createUser({
              firstName: given_name,
              lastName: family_name,
              email: email,
              password: sub,
              matricNumber: sub,
            })
              .then((res) => {
                if (res[0]) {
                  done(null, res[1]);
                }
              })
              .catch((err) => done(err));
          }
        })
        .catch((err) => done(err));
    }
  )
);

//serialize the user
passport.serializeUser(function (person, done) {
  done(null, person);
});

//deserialize user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
