const router = require("express").Router();
const { createProject } = require("../controllers/projectController");

router.post("/create", createProject);

module.exports = router;
