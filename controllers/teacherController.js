const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
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
      let teacher = await Teacher.findOne({ googleId: payload.sub });
      if (!teacher) {
        teacher = new Teacher({
          googleId: payload.sub,
          name: payload.name,
          email: payload.email,
        });
        await teacher.save();
      }
      const token = jwt.sign(
        { id: teacher._id, role: "teacher", sub: payload.sub },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else if (username && password) {
      // Manual login
      const teacher = await Teacher.findOne({ username });
      if (!teacher || !(await teacher.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: teacher._id, role: "teacher" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      res.status(400).json({ message: "Provide username/password or Google token" });
    }
  } catch (error) {
    console.error("Teacher login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.registerTeacher = async (req, res) => {
  const { username, password, name, email, contactNumber } = req.body;
  try {
    let teacher = await Teacher.findOne({ $or: [{ username }, { email }] });
    if (teacher) return res.status(400).json({ message: "Teacher already exists" });
    teacher = new Teacher({ username, password, name, email, contactNumber });
    await teacher.save();
    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, contactNumber, languages, educationalQualification, pastWorks, domains } = req.body;
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { email: req.user.email },
      {
        name,
        contactNumber,
        languages,
        educationalQualification,
        pastWorks,
        domains,
        googleId: req.user.sub,
      },
      { new: true, upsert: true }
    );
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.reviews.push({ studentId: req.user.sub, rating, comment });
    await teacher.save();

    await Student.findOneAndUpdate(
      { googleId: req.user.sub },
      { $push: { ratings: { teacherId: teacher._id, rating, comment } } },
      { upsert: true }
    );

    res.json({ message: "Review added", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin-specific methods
exports.addTeacher = async (req, res) => {
  const { name, email, contactNumber, languages, domains } = req.body;
  try {
    const teacher = new Teacher({
      googleId: `admin_${Date.now()}`,
      name,
      email,
      contactNumber,
      languages,
      domains,
      isVerified: true,
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.editTeacher = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const teacher = await Teacher.findByIdAndUpdate(id, updates, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  login: exports.login,
  registerTeacher: exports.registerTeacher,
  updateProfile: exports.updateProfile,
  getTeacherProfile: exports.getTeacherProfile,
  addReview: exports.addReview,
  addTeacher: exports.addTeacher,
  editTeacher: exports.editTeacher,
  removeTeacher: exports.removeTeacher,
  getAllTeachers: exports.getAllTeachers,
};