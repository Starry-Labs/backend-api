import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/starry",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4",
  },
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  },
  chat: {
    maxTokensPerChat: parseInt(process.env.MAX_TOKENS_PER_CHAT || "32000"),
    maxMessagesPerChat: parseInt(process.env.MAX_MESSAGES_PER_CHAT || "100"),
  },
};
