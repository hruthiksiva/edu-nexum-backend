const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const studentController = require("../controllers/studentController");

router.get("/ratings", authMiddleware, studentController.getStudentRatings);

module.exports = router;