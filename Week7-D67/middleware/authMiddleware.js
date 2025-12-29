const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protect middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ message: "Not authorized, token missing" });

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach to req
    req.user = { id: decoded.id, role: decoded.role };

    // optionally load full user object:
    // req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    // token invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };
};
