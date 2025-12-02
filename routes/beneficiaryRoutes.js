const express = require("express");
const router = express.Router();

const { requireLogin } = require("../middleware/authMiddleware");
const beneficiary = require("../controllers/beneficiaryController");

// =========================
//  Beneficiary Menu
// =========================
router.get("/menu", requireLogin, (req, res) => {
    res.render("beneficiary-menu", { user: req.session.user });
});

// =========================
//  Add Beneficiary
// =========================

// Render Add Form
router.get("/add", requireLogin, beneficiary.showAddForm);

// Handle Add POST submission
router.post(
    "/add",
    requireLogin,
    beneficiary.upload.single("photo"),  // multer for photo upload
    beneficiary.addBeneficiary
);

// View all beneficiaries
router.get("/view", beneficiary.viewBeneficiaries);
router.get("/photo/:id", beneficiary.downloadPhoto);

module.exports = router;
