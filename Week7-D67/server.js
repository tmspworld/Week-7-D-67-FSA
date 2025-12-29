require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Basic security & parsers
app.use(helmet());
app.use(
  cors({
    // origin: true, // restrict in production
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Rate limiting (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Connect DB and start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
