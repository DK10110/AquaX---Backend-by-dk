const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes using JWT authentication
 */
exports.protect = (req, res, next) => {
  // Check if Authorization header exists and extract token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // If no token is provided, deny access
  if (!token) {
    console.log("Authorization failed: No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request object
    req.user = decoded;

    console.log("Authorization successful for user:", decoded.id);
    next();
  } catch (error) {
    console.log("Authorization failed: Invalid token");
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Middleware to allow access only to admin users
 */
exports.adminOnly = (req, res, next) => {
  // Ensure user information exists
  if (!req.user || req.user.role !== "admin") {
    console.log("Access denied: Admin privileges required");
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};