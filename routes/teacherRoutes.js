const express = require('express');
const router = express.Router();

router.post('/onboard', (req, res) => {
  const { name, subject } = req.body;
  // Later: Save to database
  res.json({ message: `Teacher ${name} onboarded for ${subject}` });
});

module.exports = router;