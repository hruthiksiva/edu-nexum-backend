const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

require("./models/Teacher");
require("./models/Job");
require("./models/Webinar");
require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Teacher = mongoose.model("Teacher");

app.post("/test-teacher", async (req, res) => {
  const teacher = new Teacher({
    googleId: "12345",
    name: "John Doe",
    email: "john@example.com",
    contactNumber: "123-456-7890",
    languages: ["English"],
    domains: ["School"],
    isVerified: true,
  });
  await teacher.save();
  res.json(teacher);
});

app.get("/teachers", async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});


// Routes
app.use("/api/teacher", require("./routes/teacher"));
app.use("/api/job", require("./routes/job"));
app.use("/api/webinar", require("./routes/webinar"));
app.use("/api/student", require("./routes/student"));
app.use("/api/search", require("./routes/search"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

