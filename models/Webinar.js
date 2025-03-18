const mongoose = require("mongoose");

const WebinarSchema = new mongoose.Schema({
  teacherId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  price: { type: Number },
  registrationLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Webinar", WebinarSchema);