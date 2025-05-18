import OpenAI from "openai";
import { config } from "../config";
import { TokenCounter } from "../utils/tokenCounter";
import { astroKnowledge } from "../utils/astroKnowledge";
import { IUser } from "../types/user";
import { IMessage } from "../types/chat";

export class OpenAIService {
  private openai: OpenAI;
  private tokenCounter: TokenCounter;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.tokenCounter = new TokenCounter(config.openai.model);
  }

  async generateChatResponse(
    userMessage: string,
    chatHistory: IMessage[],
    user: IUser,
    context?: { requestType?: "general" | "compatibility"; personB?: any }
  ): Promise<{ message: string; tokens: number }> {
    try {
      // Build system prompt with user data
      const systemPrompt = this.buildSystemPrompt(user, context);

      // Format chat history for OpenAI
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [{ role: "system", content: systemPrompt }];

      // Add chat history (limit to prevent token overflow)
      const recentHistory = chatHistory.slice(-20); // Keep last 20 messages
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Add current user message
      messages.push({
        role: "user",
        content: userMessage,
      });

      // Count tokens before sending
      const totalTokens = this.tokenCounter.countMessageTokens(messages);
      console.log(`Sending ${totalTokens} tokens to OpenAI`);

      // Call OpenAI
      const completion = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseChoice = completion.choices?.[0];
      const responseMessage = responseChoice?.message.content || "";
      const responseTokens = this.tokenCounter.countTokens(responseMessage);

      return {
        message: responseMessage,
        tokens: totalTokens + responseTokens,
      };
    } catch (error) {
      console.error("OpenAI Service Error:", error);
      throw new Error("Failed to generate response from OpenAI");
    }
  }

  private buildSystemPrompt(user: IUser, context?: any): string {
    let prompt = astroKnowledge.systemPrompt;

    // Add user's birth chart data if available
    if (user.birthData || user.astrologyProfile) {
      prompt += "\n\nUser's Birth Chart Information:\n";

      if (user.astrologyProfile) {
        if (user.astrologyProfile.sunSign) {
          prompt += `- Sun Sign: ${user.astrologyProfile.sunSign}\n`;
        }
        if (user.astrologyProfile.moonSign) {
          prompt += `- Moon Sign: ${user.astrologyProfile.moonSign}\n`;
        }
        if (user.astrologyProfile.ascendantSign) {
          prompt += `- Ascendant Sign: ${user.astrologyProfile.ascendantSign}\n`;
        }
      }

      if (user.birthData) {
        prompt += `- Birth Date/Time: ${user.birthData.datetime}\n`;
        prompt += `- Birth Location: ${user.birthData.location.placeName}\n`;
      }
    }

    // Add compatibility context if provided
    if (context?.requestType === "compatibility" && context.personB) {
      prompt += "\n\nCompatibility Analysis Context:\n";
      prompt += `Analyzing compatibility between the user and another person with:\n`;
      if (context.personB.sunSign) {
        prompt += `- Sun Sign: ${context.personB.sunSign}\n`;
      }
      if (context.personB.moonSign) {
        prompt += `- Moon Sign: ${context.personB.moonSign}\n`;
      }
      if (context.personB.ascendantSign) {
        prompt += `- Ascendant Sign: ${context.personB.ascendantSign}\n`;
      }
    }

    // Add relevant astrology knowledge
    prompt += "\n\nAstrological Knowledge Reference:\n";
    prompt += JSON.stringify(astroKnowledge.signs, null, 2);

    return prompt;
  }

  async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use cheaper model for title generation
        messages: [
          {
            role: "system",
            content:
              "Generate a short, descriptive title (max 50 characters) for an astrology chat based on the user's first message. Make it engaging and specific to their query.",
          },
          {
            role: "user",
            content: firstMessage,
          },
        ],
        temperature: 0.8,
        max_tokens: 20,
      });

      const title = completion.choices?.[0]?.message?.content?.trim();
      return title || "Astrology Chat";
    } catch (error) {
      console.error("Error generating chat title:", error);
      return "Astrology Chat";
    }
  }

  countTokens(text: string): number {
    return this.tokenCounter.countTokens(text);
  }
}
