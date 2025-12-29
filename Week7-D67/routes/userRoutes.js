const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// protected profile
router.get("/profile", protect, userController.getProfile);

// update profile
router.put("/profile", protect, userController.updateProfile);

// admin-only route
router.get(
  "/admin/users",
  protect,
  authorize("admin"),
  userController.getAllUsers
);

module.exports = router;
