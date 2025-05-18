export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tokens?: number;
}

export interface IChat {
  _id?: string;
  userId: string;
  title: string;
  messages: IMessage[];
  totalTokens: number;
  lastUpdated: Date;
  createdAt: Date;
}
