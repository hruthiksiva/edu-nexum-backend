const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password, googleToken } = req.body;
  try {
    if (googleToken) {
      // Google login
      const { OAuth2Client } = require("google-auth-library");
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      let student = await Student.findOne({ googleId: payload.sub });
      if (!student) {
        student = new Student({
          googleId: payload.sub,
          name: payload.name,
          email: payload.email,
        });
        await student.save();
      }
      const token = jwt.sign(
        { id: student._id, role: "student", sub: payload.sub },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else if (username && password) {
      // Manual login
      const student = await Student.findOne({ username });
      if (!student || !(await student.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: student._id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(400).json({ message: "Provide username/password or Google token" });
    }
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      $or: [{ googleId: req.user.sub }, { _id: req.user.id }],
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { login, getStudentProfile };