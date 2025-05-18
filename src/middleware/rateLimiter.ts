import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { config } from "../config";

const rateLimiter = new RateLimiterMemory({
  keyPrefix: "rateLimiter",
  points: config.rateLimit.maxRequests,
  duration: Math.floor(config.rateLimit.windowMs / 1000),
  execEvenly: true,
  blockDuration: 0,
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    await rateLimiter.consume(ip);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set("Retry-After", String(secs));
    res.status(429).json({
      error: "Too many requests",
      retryAfter: secs,
    });
  }
};

// Error handling middleware
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
