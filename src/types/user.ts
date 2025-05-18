export interface IUser {
  _id?: string;
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
  astrologyProfile?: {
    sunSign?: string;
    moonSign?: string;
    ascendantSign?: string;
  };
  chatId?: string; // Reference to user's single chat
  createdAt: Date;
  updatedAt: Date;
}
