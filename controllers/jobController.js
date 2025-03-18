const Job = require("../models/Job");

const postJob = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("User from auth:", req.user);
  const { title, description, tags } = req.body;

  try {
    if (!req.user) {
      throw new Error("No authenticated user found");
    }
    if (!req.user.sub && !req.user.id) {
      throw new Error("No valid user ID (sub or id) found in token");
    }

    const studentId = req.user.sub || req.user.id; // Support both Google (sub) and admin JWT (id)
    const job = new Job({
      studentId,
      title,
      description,
      tags,
    });
    console.log("Job to save:", job);
    await job.save();
    console.log("Job saved successfully:", job);
    res.status(201).json(job);
  } catch (error) {
    console.error("Post job error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const applyForJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.applicants.push({ teacherId: req.user.sub || req.user.id });
    await job.save();
    res.json({ message: "Applied successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id).populate("applicants.teacherId", "name email contactNumber");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  postJob,
  getJobs,
  applyForJob,
  getJobApplicants,
};