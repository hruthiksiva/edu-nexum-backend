const Webinar = require("../models/Webinar");

const createWebinar = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("User from auth:", req.user);
  const { title, description, date, isPaid, price, registrationLink } = req.body;
  try {
    if (!req.user || (!req.user.sub && !req.user.id)) {
      console.log("No authenticated user or ID found");
      throw new Error("No authenticated user or ID found");
    }
    const teacherId = req.user.sub || req.user.id; // Support Google sub or admin id
    const webinar = new Webinar({
      teacherId,
      title,
      description,
      date,
      isPaid,
      price: isPaid ? price : undefined,
      registrationLink,
    });
    console.log("Webinar to save:", webinar);
    const savedWebinar = await webinar.save();
    console.log("Webinar saved successfully:", savedWebinar);
    res.status(201).json(savedWebinar);
  } catch (error) {
    console.error("Create webinar error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find();
    console.log("Fetched webinars:", webinars);
    res.json(webinars);
  } catch (error) {
    console.error("Get webinars error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWebinar,
  getWebinars,
};