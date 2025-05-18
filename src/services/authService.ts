import jwt, { SignOptions } from "jsonwebtoken"; // Ensure to import SignOptions
import { config } from "../config";
import { JWTPayload } from "../types/auth";

import { User } from "../models/User";
import { createError } from "../utils/errors";

export class AuthService {
  generateToken(payload: JWTPayload): string {
    const signOptions: SignOptions = {
      expiresIn: parseInt(config.jwt.expiresIn, 10), // Ensure signOptions type matches the imported SignOptions type
    };
    return jwt.sign(
      payload as object,
      config.jwt.secret as jwt.Secret,
      signOptions
    );
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw createError("Invalid or expired token", 401);
    }
  }

  async getUserFromToken(token: string) {
    const decoded = this.verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw createError("User not found", 404);
    }

    return user;
  }
}
