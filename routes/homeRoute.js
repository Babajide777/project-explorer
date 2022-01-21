const router = require("express").Router();
const { getFourRecentProject } = require("../controllers/homeController");

router.get("/", getFourRecentProject);
module.exports = router;
