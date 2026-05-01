const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", adminRoutes);

// Root route (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("SRMS Backend is Running 🚀");
});

// Global error handler (prevents crash)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Server Error" });
});

// Start server ONLY after DB connects
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // wait for MongoDB

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();