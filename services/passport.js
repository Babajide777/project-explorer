const User = require("../models/userModel");
const passport = require("passport");
const { getByEmail, getUrl, createUser } = require("./userService");
const facebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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

// Google Authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${getUrl()}auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const { sub, name, given_name, family_name, email } = profile._json;
      getByEmail(email)
        .then((person) => {
          if (person) {
            return done(null, person);
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

passport.serializeUser(function (person, done) {
  done(null, person.sub);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
