const router = require("express").Router();
const { userLogin } = require("../controllers/userController");

router.post("/login", userLogin);
module.exports = router;
