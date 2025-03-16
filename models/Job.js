const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  studentId: {
    type: String, // Google Auth ID of the student (anonymous)
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true, // e.g., ["Math", "High School", "Beginner"]
    },
  ],
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  applicants: [
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
jobSchema.index({ tags: 1 });
jobSchema.index({ status: 1, createdAt: -1 }); // Sort open jobs by recency

// Pre-save hook to update `updatedAt`
jobSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Job", jobSchema);