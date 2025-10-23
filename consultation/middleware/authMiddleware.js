// Authentication middleware to validate JWT tokens issued by the central User Authentication service
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // TODO: Replace with actual JWT verification using the secret from User Authentication service
    // This is a stub for JWT verification. In production, verify against the central auth service.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
