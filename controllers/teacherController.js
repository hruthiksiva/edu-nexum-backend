const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

exports.registerTeacher = async (req, res) => {
  const { name, email, contactNumber } = req.body;
  try {
    // Public endpoint for contact form submission
    const teacher = new Teacher({
      name,
      email,
      contactNumber,
      googleId: "pending_" + Date.now(), // Temporary ID until verified
    });
    await teacher.save();
    res.status(201).json({ message: "Registration submitted. Our team will contact you." });
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
        googleId: req.user.sub, // Update with actual Google ID
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

    // Update student's ratings
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