const router = require("express").Router();
const {
  createProject,
  getProject,
  projectSearch,
} = require("../controllers/projectController");

//project routes
router.post("/create", createProject);
router.post("/getProject", getProject);
router.get("*/search", projectSearch);

module.exports = router;
