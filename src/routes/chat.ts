import express from "express";
import { ChatController } from "../controllers/chatController";
import { authenticate } from "../middleware/auth";
import { validateChatRequest } from "../middleware/validation";
import { rateLimitMiddleware } from "../middleware/rateLimiter";

const router = express.Router();
const chatController = new ChatController();

// All chat routes require authentication
router.use(authenticate);

// Chat routes
router.post(
  "/message",
  rateLimitMiddleware,
  validateChatRequest,
  chatController.sendMessage
);
router.get("/history", chatController.getChatHistory);
router.delete("/clear", chatController.clearChat);
router.get("/stats", chatController.getChatStats);

export { router as chatRoutes };
