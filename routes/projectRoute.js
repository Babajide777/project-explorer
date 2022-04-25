const router = require("express").Router();
const {
  createProject,
  getProject,
} = require("../controllers/projectController");

//project routes
router.post("/create", createProject);
router.post("/getProject", getProject);

module.exports = router;
