import { Request, Response, NextFunction } from "express";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { OpenAIService } from "../services/openaiService";
import { createError } from "../utils/errors";
import { config } from "../config";
import { ChatRequest } from "../types/api";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class ChatController {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  sendMessage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;
      const { message, context }: ChatRequest = req.body;

      // Get or create user's chat
      let chat = await Chat.findOne({ userId: user._id });
      if (!chat) {
        chat = new Chat({
          userId: user._id,
          title: "New Astrology Chat",
          messages: [],
        });
        await chat.save();

        // Link chat to user
        user.chatId = chat._id;
        await user.save();
      }

      // Check token limits before processing
      const messageTokens = this.openaiService.countTokens(message);

      if (chat.totalTokens + messageTokens > config.chat.maxTokensPerChat) {
        throw createError(
          "Chat has reached maximum token limit. Please start a new conversation.",
          400
        );
      }

      if (chat.messages.length >= config.chat.maxMessagesPerChat) {
        throw createError(
          "Chat has reached maximum message limit. Please start a new conversation.",
          400
        );
      }

      // Generate chat title if this is the first message
      let titleUpdated = false;
      if (chat.messages.length === 0) {
        const newTitle = await this.openaiService.generateChatTitle(message);
        chat.title = newTitle;
        titleUpdated = true;
      }

      // Add user message to chat
      const userMessage = {
        role: "user" as const,
        content: message,
        timestamp: new Date(),
        tokens: messageTokens,
      };
      chat.messages.push(userMessage);

      // Generate AI response
      const aiResponse = await this.openaiService.generateChatResponse(
        message,
        chat.messages.slice(0, -1), // Don't include the current message in history
        user,
        context
      );

      // Add AI message to chat
      const aiMessage = {
        role: "assistant" as const,
        content: aiResponse.message,
        timestamp: new Date(),
        tokens: aiResponse.tokens,
      };
      chat.messages.push(aiMessage);

      // Update total tokens
      chat.totalTokens += messageTokens + aiResponse.tokens;

      // Save chat
      await chat.save();

      // Prepare response
      const response: any = {
        message: aiResponse.message,
        totalTokens: chat.totalTokens,
        remainingTokens: config.chat.maxTokensPerChat - chat.totalTokens,
        messagesCount: chat.messages.length,
        maxMessages: config.chat.maxMessagesPerChat,
      };

      if (titleUpdated) {
        response.chatTitle = chat.title;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getChatHistory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;
      const chat = await Chat.findOne({ userId: user._id });

      if (!chat) {
        // Return empty chat structure
        res.json({
          chat: {
            title: "New Astrology Chat",
            messages: [],
            totalTokens: 0,
            remainingTokens: config.chat.maxTokensPerChat,
            messagesCount: 0,
            maxMessages: config.chat.maxMessagesPerChat,
            lastUpdated: new Date(),
            createdAt: new Date(),
          },
        });
        return;
      }

      res.json({
        chat: {
          title: chat.title,
          messages: chat.messages,
          totalTokens: chat.totalTokens,
          remainingTokens: config.chat.maxTokensPerChat - chat.totalTokens,
          messagesCount: chat.messages.length,
          maxMessages: config.chat.maxMessagesPerChat,
          lastUpdated: chat.lastUpdated,
          createdAt: chat.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  clearChat = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;

      // Find and clear the chat
      const chat = await Chat.findOne({ userId: user._id });
      if (chat) {
        chat.messages = [];
        chat.totalTokens = 0;
        chat.title = "New Astrology Chat";
        await chat.save();
      }

      res.json({
        message: "Chat cleared successfully",
        chat: {
          title: "New Astrology Chat",
          messages: [],
          totalTokens: 0,
          remainingTokens: config.chat.maxTokensPerChat,
          messagesCount: 0,
          maxMessages: config.chat.maxMessagesPerChat,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getChatStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user;
      const chat = await Chat.findOne({ userId: user._id });

      const stats = {
        totalTokens: chat?.totalTokens || 0,
        remainingTokens:
          config.chat.maxTokensPerChat - (chat?.totalTokens || 0),
        messagesCount: chat?.messages.length || 0,
        maxMessages: config.chat.maxMessagesPerChat,
        maxTokens: config.chat.maxTokensPerChat,
        lastActivity: chat?.lastUpdated || null,
      };

      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}
