const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// refresh token
router.post("/refresh-token", authController.refreshToken);

// logout
router.post("/logout", authController.logout);

module.exports = router;
