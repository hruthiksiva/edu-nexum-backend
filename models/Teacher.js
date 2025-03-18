const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Sparse for optional Google auth
  username: { type: String, unique: true, sparse: true }, // Sparse for optional manual auth
  password: { type: String }, // Hashed password for manual auth
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  contactNumber: { type: String },
  ratings: [{ teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, rating: Number, comment: String }],
  createdAt: { type: Date, default: Date.now },
});

StudentSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

StudentSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Student", StudentSchema);