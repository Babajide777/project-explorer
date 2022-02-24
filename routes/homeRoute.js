const router = require("express").Router();
const {
  getFourRecentProject,
  getPrograms,
  getGraduationYears,
} = require("../controllers/homeController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", getFourRecentProject);
router.post("/", verifyToken, (req, res) => {
  console.log("here");
});
router.get("/programs", getPrograms);
router.get("/graduationyears", getGraduationYears);
module.exports = router;
