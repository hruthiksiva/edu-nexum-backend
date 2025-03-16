const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const teacherController = require("../controllers/teacherController");

router.post("/register", teacherController.registerTeacher); // Public
router.put("/profile", authMiddleware, teacherController.updateProfile);
router.get("/:id", teacherController.getTeacherProfile); // Public
router.post("/:id/review", authMiddleware, teacherController.addReview);

module.exports = router;