const router = require("express").Router();
const {
  getFourRecentProject,
  getPrograms,
  getGraduationYears,
} = require("../controllers/homeController");

router.get("/", getFourRecentProject);
router.get("/progams", getPrograms);
router.get("/graduationyears", getGraduationYears);
module.exports = router;
