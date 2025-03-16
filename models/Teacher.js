const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: "https://example.com/default-avatar.png", // Placeholder URL
  },
  languages: [
    {
      type: String,
      trim: true,
    },
  ],
  educationalQualification: [
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      year: { type: Number },
    },
  ],
  pastWorks: [
    {
      title: { type: String, required: true },
      description: { type: String },
      link: { type: String }, // Optional URL to work
    },
  ],
  proofs: [
    {
      type: String, // URLs to certificates or documents
    },
  ],
  reviews: [
    {
      studentId: { type: String }, // Anonymous student ID (from Google Auth)
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  domains: [
    {
      type: String,
      trim: true, // e.g., ["School", "Digital Skills", "Hobbies"]
    },
  ],
  isVerified: {
    type: Boolean,
    default: false, // Set to true after support team verifies eligibility
  },
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
teacherSchema.index({ email: 1 });
teacherSchema.index({ domains: 1 });
teacherSchema.index({ averageRating: -1 }); // Sort by rating descending

// Pre-save hook to update `updatedAt`
teacherSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating before saving
teacherSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);