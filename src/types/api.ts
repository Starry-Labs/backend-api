export interface ChatRequest {
  message: string;
  context?: {
    requestType?: "general" | "compatibility";
    personB?: {
      sunSign?: string;
      moonSign?: string;
      ascendantSign?: string;
    };
  };
}

export interface ChatResponse {
  message: string;
  chatTitle?: string;
  totalTokens: number;
  remainingTokens: number;
}
