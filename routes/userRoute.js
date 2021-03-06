const router = require("express").Router();
const {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
  userProfileDetails,
  userProfileChangePwd,
  userContinueSignup,
  updateUserContinueSignup,
  userProfileUpdate,
} = require("../controllers/userController");
const multer = require("multer");
const { storage } = require("../services/cloudinary");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = multer({ storage });

//user routes
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/forgotpassword", userForgotPassword);
router.put("/resetpassword", userResetPassword);
router.get("/profiledetails/:id", userProfileDetails);
router.put("/profilechangepwd", userProfileChangePwd);
router.post("/continuesignup", verifyToken, userContinueSignup);
router.put("/updatecontinuesignup", updateUserContinueSignup);
router.put(
  "/profileupdate",
  upload.single("profilePicture"),
  userProfileUpdate
);
module.exports = router;
