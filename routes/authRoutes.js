const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// Views
router.get("/login", (req, res) => {
  const { message = null, type = null } = req.query;
  res.render("login", { message, type });
});
router.get("/signup", (req, res) => res.render("signup"));

// Actions
router.post("/login", auth.login);
router.post("/signup", auth.signup);
router.get("/logout", auth.logout);
router.post("/forgot-direct", auth.directPasswordReset);

module.exports = router;
