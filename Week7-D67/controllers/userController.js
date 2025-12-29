const User = require("../models/User");

// GET /api/profile  (protected)
exports.getProfile = async (req, res, next) => {
  try {
    // authMiddleware attaches req.user (id, role)
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ profile: user });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users  (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshTokens");
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile  (update own profile)
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password -refreshTokens");
    res.json({ profile: user });
  } catch (err) {
    next(err);
  }
};
