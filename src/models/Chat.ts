import mongoose, { Schema, Document } from "mongoose";
import { IChat, IMessage } from "../types/chat";

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    tokens: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: String, // Change type to String to fix the error
      ref: "User",
      required: true,
      unique: true, // Each user has only one chat
    },
    title: {
      type: String,
      required: true,
      default: "New Astrology Chat",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastUpdated on save
chatSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
