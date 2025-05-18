import express from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateRegisterRequest } from "../middleware/validation";
import { rateLimitMiddleware } from "../middleware/rateLimiter";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  rateLimitMiddleware,
  validateRegisterRequest,
  authController.register
);
router.post("/login", rateLimitMiddleware, authController.login);

// Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);

export { router as authRoutes };
