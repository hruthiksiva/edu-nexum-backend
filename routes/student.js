const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.post("/login", studentController.login);
router.get("/profile", studentController.getStudentProfile); // Already protected by authMiddleware

module.exports = router;