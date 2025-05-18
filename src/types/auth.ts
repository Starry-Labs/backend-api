export interface LoginRequest {
  telegramHandle: string;
  password: string;
}

export interface RegisterRequest {
  telegramHandle: string;
  name: string;
  email?: string;
  password: string;
  birthData?: {
    datetime: Date;
    location: {
      latitude: number;
      longitude: number;
      placeName: string;
    };
    timezone?: string;
  };
}

export interface JWTPayload {
  userId: string;
  telegramHandle: string;
}
