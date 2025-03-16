const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const webinarController = require("../controllers/webinarController");

router.post("/", authMiddleware, webinarController.createWebinar);
router.get("/", webinarController.getAllWebinars); // Public
router.get("/my-webinars", authMiddleware, webinarController.getTeacherWebinars);

module.exports = router;