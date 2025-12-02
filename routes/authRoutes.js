const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Views
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));

// Actions
router.post("/login", auth.login);
router.post("/signup", auth.signup);
router.get("/logout", auth.logout);

module.exports = router;
