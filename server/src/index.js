const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const heimdall = require('heimdall-nodejs-sdk');

// Import routes
const authRoutes = require("./routes/auth.routes");
const serverRoutes = require("./routes/server.routes");
const userRoutes = require("./routes/user.routes");

// Create Express app
const app = express();
heimdall.ping(app)
const prisma = new PrismaClient();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Heimdall API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  // Disconnect from Prisma
  await prisma.$disconnect();
  console.log("Prisma client disconnected");

  // Close the server
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = app;
