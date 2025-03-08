const jwt = require("jsonwebtoken");

const verifyJWTToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ success: false, message: "Access denied, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(400).json({ success: false, message: "Invalid token structure" });
    }

    // Attach user to request object
    req.user = { id: decoded.userId, role: decoded.role };

    console.log("Decoded User:", req.user); // Debugging purpose

    next(); // ✅ Move to the next middleware
  } catch (err) {
    console.error("JWT Error:", err.message); // Log error for debugging
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Middleware to check if user is ADMIN
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied, admin only" });
  }
  next(); // ✅ Ensure next() is called
};

// Middleware to check if user is CUSTOMER
const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ success: false, message: "Access denied, user only" });
  }
  next(); // ✅ Ensure next() is called
};

module.exports = { verifyJWTToken, isAdmin, isUser };
