const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const teacherController = require("../controllers/teacherController");

router.post("/login", teacherController.login);
router.post("/register", teacherController.registerTeacher);
router.put("/profile", authMiddleware, teacherController.updateProfile);
router.get("/:id", teacherController.getTeacherProfile);
router.post("/:id/review", authMiddleware, teacherController.addReview);

module.exports = router;