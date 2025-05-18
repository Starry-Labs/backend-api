import { encoding_for_model } from "tiktoken";

export class TokenCounter {
  private encoding;

  constructor(model: string = "gpt-4") {
    this.encoding = encoding_for_model(model as any);
  }

  countTokens(text: string): number {
    return this.encoding.encode(text).length;
  }

  countMessageTokens(
    messages: Array<{ role: string; content: string }>
  ): number {
    let totalTokens = 0;

    for (const message of messages) {
      // Add tokens for role and content
      totalTokens += this.countTokens(message.role);
      totalTokens += this.countTokens(message.content);
      // Add overhead tokens per message (varies by model)
      totalTokens += 4;
    }

    return totalTokens;
  }
}
