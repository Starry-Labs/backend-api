import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/errors";

export const validateRegisterRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { telegramHandle, name, password } = req.body;

  if (!telegramHandle || !name || !password) {
    throw createError("Telegram handle, name, and password are required", 400);
  }

  if (password.length < 6) {
    throw createError("Password must be at least 6 characters long", 400);
  }

  // Validate telegram handle format
  if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(telegramHandle)) {
    throw createError("Invalid Telegram handle format", 400);
  }

  next();
};

export const validateChatRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw createError("Message is required", 400);
  }

  if (message.length > 2000) {
    throw createError("Message too long (max 2000 characters)", 400);
  }

  next();
};
