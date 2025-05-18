import express from "express";
import { authRoutes } from "./auth";
import { chatRoutes } from "./chat";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);

export { router as apiRoutes };
