const express = require("express");
const router = express.Router();
const path = require("path");

const project = require("../services/project");

router.get("/", async (req, res) => {
  const projects = await project.getAll();
  const user = req.session.user;

  res.render("Home", { props: projects, us: user });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/google760eec1bc6bf0123.html", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../" + "/views/google760eec1bc6bf0123.html")
  );
});

module.exports = router;
