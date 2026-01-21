const express = require("express");
const router = express.Router();

const { requireLogin } = require("../middleware/authMiddleware");
const jobMatching = require("../controllers/jobMatchingController");

// List jobs to match
router.get("/", requireLogin, jobMatching.listJobs);

// View beneficiaries relevant to a job (Recommended + Other)
router.get("/:providerId", requireLogin, jobMatching.viewBeneficiariesForJob);

// Create a match
router.post("/:providerId/match/:beneficiaryId", requireLogin, jobMatching.createMatch);

module.exports = router;