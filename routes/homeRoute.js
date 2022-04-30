const router = require("express").Router();
const {
  getFourRecentProject,
  getPrograms,
  getGraduationYears,
  headerFunc,
} = require("../controllers/homeController");
const { verifyToken } = require("../middlewares/authMiddleware");

//home page routes
router.get("/", getFourRecentProject);
router.post("/", verifyToken, headerFunc);
router.get("/programs", getPrograms);
router.get("/graduationyears", getGraduationYears);

module.exports = router;
