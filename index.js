import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, isDBConnected } from "./src/config/database.js";
import { validateConfig } from "./src/config/config.js";
import { logger } from "./src/middleware/logger.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
import { apiRouter } from "./src/routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// ========================================
// Middleware Setup
// ========================================

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Logger middleware
app.use(logger);

// ========================================
// Database Connection
// ========================================

const initializeDatabase = async () => {
  try {
    validateConfig();
    await connectDB();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    process.exit(1);
  }
};

// ========================================
// Routes
// ========================================

// API routes
app.use("/api", apiRouter);

// Home route
app.get("/", (req, res) => {
  return res.json({
    msg: "Welcome to CodeSync API",
    version: "1.0.0",
    dbConnected: isDBConnected(),
    endpoints: {
      users: "/api/users",
      leetcode: "/api/leetcode/:username",
      codeforces: "/api/codeforces/:username",
      codechef: "/api/codechef/:username",
      gfg: "/api/gfg/:username",
      roadmap: "/api/roadmap",
      documentation: "/docs",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    dbConnected: isDBConnected(),
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// Error Handling Middleware (must be last)
// ========================================

// 404 Not Found
app.use(notFound);

// Error handler
app.use(errorHandler);

// ========================================
// Server Startup
// ========================================

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api/users`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
