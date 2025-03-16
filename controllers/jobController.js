const Job = require("../models/Job");
const Teacher = require("../models/Teacher");

exports.postJob = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const job = new Job({
      studentId: req.user.sub,
      title,
      description,
      tags,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== "open") return res.status(404).json({ message: "Job not found or closed" });

    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) return res.status(403).json({ message: "Only teachers can apply" });

    job.applicants.push({ teacherId: teacher._id });
    await job.save();
    res.json({ message: "Applied successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants.teacherId", "name email contactNumber");
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.studentId !== req.user.sub) return res.status(403).json({ message: "Unauthorized" });
    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};