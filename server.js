const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────
// Allows frontend to send JSON data to backend
app.use(express.json());

// Allows frontend (different domain/port) to talk to backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));

// ─── Health Check Route ────────────────────────────────────────
// Used to check if backend is running (Render uses this)
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running!" });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// ─── Connect to MongoDB & Start Server ────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });