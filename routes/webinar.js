const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const webinarController = require("../controllers/webinarController");

console.log("webinarController:", webinarController);

router.post("/", authMiddleware, webinarController.createWebinar);
router.get("/", webinarController.getWebinars);

module.exports = router;