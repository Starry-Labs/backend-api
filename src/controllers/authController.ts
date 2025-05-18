import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { AuthService } from "../services/authService";
import { createError } from "../utils/errors";
import { RegisterRequest, LoginRequest } from "../types/auth";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        telegramHandle,
        name,
        email,
        password,
        birthData,
      }: RegisterRequest = req.body;

      // Clean telegram handle
      const cleanHandle = telegramHandle.startsWith("@")
        ? telegramHandle.slice(1).toLowerCase()
        : telegramHandle.toLowerCase();

      // Check if user already exists
      const existingUser = await User.findOne({ telegramHandle: cleanHandle });
      if (existingUser) {
        throw createError("User with this telegram handle already exists", 400);
      }

      // Create user
      const user = new User({
        telegramHandle: cleanHandle,
        name,
        email,
        password,
        birthData,
      });

      await user.save();

      // Create initial chat for the user
      const chat = new Chat({
        userId: user._id,
        title: "Welcome to Starry",
        messages: [],
      });

      await chat.save();

      // Link chat to user
      user.chatId = chat._id;
      await user.save();

      // Generate token
      const token = this.authService.generateToken({
        userId: user._id!.toString(),
        telegramHandle: user.telegramHandle,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { telegramHandle, password }: LoginRequest = req.body;

      if (!telegramHandle || !password) {
        throw createError("Telegram handle and password are required", 400);
      }

      // Clean telegram handle
      const cleanHandle = telegramHandle.startsWith("@")
        ? telegramHandle.slice(1).toLowerCase()
        : telegramHandle.toLowerCase();

      // Find user
      const user = await User.findOne({ telegramHandle: cleanHandle });
      if (!user) {
        throw createError("Invalid credentials", 401);
      }

      // Check password
      const isPasswordValid = await (user as any).comparePassword(password);
      if (!isPasswordValid) {
        throw createError("Invalid credentials", 401);
      }

      // Generate token
      const token = this.authService.generateToken({
        userId: user._id!.toString(),
        telegramHandle: user.telegramHandle,
      });

      res.json({
        message: "Login successful",
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = (req as any).user;
      res.json({
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = (req as any).user;
      const updates = req.body;

      // Prevent updating sensitive fields
      delete updates.password;
      delete updates.telegramHandle;
      delete updates._id;

      // Update user
      Object.assign(user, updates);
      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };
}
