const router = require("express").Router();
const {
  createProject,
  getProject,
  projectSearch,
  projectUpdateLastVisit,
} = require("../controllers/projectController");

//project routes
router.post("/create", createProject);
router.post("/getProject", getProject);
router.get("/search/*", projectSearch);
router.post("/updatelastvisited", projectUpdateLastVisit);

module.exports = router;
