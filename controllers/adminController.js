const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password });
  try {
    const admin = await Admin.findOne({ username });
    console.log("Found admin:", admin);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    const isMatch = await admin.comparePassword(password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET, // This uses your secret
      { expiresIn: "1h" }
    );
    console.log("Generated token:", token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};