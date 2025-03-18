const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

require("./models/Teacher");
require("./models/Job");
require("./models/Webinar");
require("./models/Student");
require("./models/Admin");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/student", require("./routes/student"));
app.use("/api/teacher", require("./routes/teacher"));
app.use("/api/job", require("./routes/job"));
app.use("/api/webinar", require("./routes/webinar"));
app.use("/api/student", require("./routes/student"));
app.use("/api/search", require("./routes/search"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));