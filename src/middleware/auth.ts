import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { createError } from "../utils/errors";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError("Access token is required", 401);
    }

    const token = authHeader.substring(7);
    const authService = new AuthService();

    // Verify token and get user
    const user = await authService.getUserFromToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    res.status(400).json({
      error: "Validation Error",
      details: errors,
    });
    return;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    res.status(400).json({
      error: "Resource already exists",
      details: "A user with this telegram handle already exists",
    });
    return;
  }

  // Custom operational errors
  if (error.isOperational) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: "Internal Server Error",
  });
};
