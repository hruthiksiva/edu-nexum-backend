const Webinar = require("../models/Webinar");
const Teacher = require("../models/Teacher");

exports.createWebinar = async (req, res) => {
  const { title, description, date, isPaid, price, registrationLink } = req.body;
  try {
    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) return res.status(403).json({ message: "Only teachers can create webinars" });

    const webinar = new Webinar({
      teacherId: teacher._id,
      title,
      description,
      date,
      isPaid,
      price: isPaid ? price : 0,
      registrationLink,
    });
    await webinar.save();
    res.status(201).json(webinar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({ status: "upcoming" })
      .populate("teacherId", "name email")
      .sort({ date: 1 });
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTeacherWebinars = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) return res.status(403).json({ message: "Teacher not found" });

    const webinars = await Webinar.find({ teacherId: teacher._id }).sort({ date: -1 });
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};