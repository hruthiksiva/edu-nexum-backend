const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Try Google auth first
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    req.user = ticket.getPayload();
    req.userType = "google";
    console.log("Google auth user:", req.user);
    next();
  } catch (error) {
    // Try JWT (manual auth)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.userType = decoded.role; // "student" or "teacher"
      console.log("JWT auth user:", req.user);
      next();
    } catch (err) {
      console.error("Auth error:", err);
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = { authMiddleware };