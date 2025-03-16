const Teacher = require("../models/Teacher");

exports.searchTeachers = async (req, res) => {
  const { query } = req.query;
  try {
    const teachers = await Teacher.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { domains: { $regex: query, $options: "i" } },
        { languages: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ averageRating: -1 })
      .limit(10); // Limit to top 10 results
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};