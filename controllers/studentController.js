const Student = require("../models/Student");

exports.getStudentRatings = async (req, res) => {
  try {
    const student = await Student.findOne({ googleId: req.user.sub }).populate(
      "ratings.teacherId",
      "name"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};