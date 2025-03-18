const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const teacherController = require("../controllers/teacherController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/login", adminController.login);
router.get("/teachers", authMiddleware, adminMiddleware, teacherController.getAllTeachers);
router.post("/teachers", authMiddleware, adminMiddleware, teacherController.addTeacher);
router.put("/teachers/:id", authMiddleware, adminMiddleware, teacherController.editTeacher);
router.delete("/teachers/:id", authMiddleware, adminMiddleware, teacherController.removeTeacher);

module.exports = router;