const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const user = require("../services/user");
const { createMail } = require("../services/sendMail");
const methodOverride = require("method-override");
const multer = require("multer");
const { storage } = require("../../cloudinary/cloudinary");
const upload = multer({ storage });

const router = express.Router();
router.use(methodOverride("_method"));

// SignUp routes
router.get("/signup", (req, res) => {
  const programs = getPrograms();
  const graduationYears = getGradYears();

  const error = req.flash("error");
  const user = req.session.user;

  res.render("Signup", {
    program: programs,
    graduationYear: graduationYears,
    err: error,
    us: user,
  });
});

router.post("/signup", async (req, res) => {
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;

  const { email, password, program, matricNumber, graduationYear } = req.body;

  const check = await user.create({
    firstname,
    lastname,
    email,
    password,
    matricNumber,
    program,
    graduationYear,
  });

  if (check[0]) {
    req.session.user = check[1];
    res.redirect("/");
  } else {
    req.flash("error", await check[1]);
    res.redirect(303, "/signup");
  }
});

// Login routes
router.get("/login", (req, res) => {
  const error = req.flash("error");
  const user = req.session.user;

  res.render("Login", { err: error, us: user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const check = await user.authenticate(email, password);

  if (check[0]) {
    req.session.user = check[1];
    res.redirect("/");
  } else {
    req.flash("error", check[1][0]);
    res.redirect(303, "/login");
  }
});

// Forget password routes
router.get("/forgotpassword", (req, res) => {
  const user = req.session.user;
  const error = req.flash("error");
  res.render("ForgotPassword", { us: user, err: error });
});

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  const check = await user.getByEmail(email);

  if (check) {
    createMail(email, check._id);
    res.redirect("/login");
  } else {
    req.flash("error", "Email does not exist");
    res.redirect(303, "/forgotpassword");
  }
});

// Routes to reset password
router.get("/resetpassword/:id", (req, res) => {
  const user = req.session.user;
  const error = req.flash("error");

  res.render("ResetPassword", { us: user, err: error, id: req.params.id });
});

router.post("/resetpassword/", async (req, res) => {
  const { password, confirmPassword, id } = req.body;

  if (password.length < 8) {
    req.flash("error", "Password must have at least 8 characters");
    res.redirect(303, `/resetpassword/${id}`);
  } else {
    if (password === confirmPassword) {
      await user.updatePassword(id, password);
      res.redirect("/");
    } else {
      req.flash("error", "Passwords do not match");
      res.redirect(303, `/resetpassword/${id}`);
    }
  }
});

// Route to view profile details
router.get("/editprofile/:id", async (req, res) => {
  const details = await user.getById(req.params.id);
  const programs = getPrograms();
  const graduationYears = getGradYears();
  const error1 = req.flash("error1");
  const success = req.flash("success");

  res.render("EditProfile", {
    us: req.session.user,
    details: details,
    programs: programs,
    graduationYears: graduationYears,
    err1: error1,
    success,
  });
});

// Route for updating user profile
router.patch(
  "/editprofile/",
  upload.single("profilePicture"),
  async (req, res) => {
    const {
      firstname,
      lastname,
      email,
      program,
      matricNumber,
      graduationYear,
      id,
    } = req.body;

    let fields = {
      firstname,
      lastname,
      email,
      program,
      matricNumber,
      graduationYear,
    };

    if (req.file !== undefined) {
      fields.profilePicture = req.file.path;
      req.session.user.profilePicture = user.scaledPicture(req.file.path);
    }
    await user.updateProfile(fields);
    req.flash("success", "Your profile was updated successfully");
    res.redirect(303, `/editprofile/${id}`);
  }
);

// Route for changing password
router.put("/editprofile/", async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, email, id } = req.body;
  const check = await user.authenticate(email, currentPassword);

  if (check[0]) {
    if (newPassword.length < 8) {
      req.flash("error1", "Password must have at least 8 characters");
      res.redirect(303, `/editprofile/${id}`);
    } else {
      if (newPassword === confirmPassword) {
        await user.updatePassword(id, newPassword);
        res.redirect("/");
      } else {
        req.flash("error1", "Passwords do not match");
        res.redirect(303, `/editprofile/${id}`);
      }
    }
  } else {
    req.flash("error1", "The current password is incorrect");
    res.redirect(303, `/editprofile/${id}`);
  }
});

//routes to continue social media sign up
router.get("/continuesignup", (req, res) => {
  const user = req.session.user;
  const programs = getPrograms();
  const graduationYears = getGradYears();
  const err = req.flash("err");

  res.render("ContinueSignUp", { us: user, programs, graduationYears, err });
});

router.put("/continuesignup", async (req, res) => {
  const { matricNumber, program, graduationYear, password, id, email } =
    req.body;
  if (password.length < 8) {
    req.flash("err", "Password must have at least 8 characters");
    res.redirect(303, `/continuesignup`);
  } else {
    await user.updatePassword(id, password);
    let fields = {
      program,
      matricNumber,
      graduationYear,
      email,
    };
    await user.updateProfile(fields);
    res.redirect(`/`);
  }
});

module.exports = router;
