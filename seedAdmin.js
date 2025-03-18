const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("MongoDB connected");
  const admin = new Admin({
    username: "admin2",
    password: "admin1234",
  });
  await admin.save();
  console.log("Admin user created with password:", admin.password);
  process.exit();
}).catch((err) => console.error(err));