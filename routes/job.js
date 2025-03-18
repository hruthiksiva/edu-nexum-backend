const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const jobController = require("../controllers/jobController");

console.log("jobController:", jobController);

router.post("/", authMiddleware, jobController.postJob);
router.get("/", jobController.getJobs);
router.post("/:id/apply", authMiddleware, jobController.applyForJob);
router.get("/:id/applicants", authMiddleware, jobController.getJobApplicants);

module.exports = router;