import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema({
  meetingCode: { type: String, required: true },
  sender: { type: String, required: true }, // username or user ID
  socketIdSender: { type: String },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export { ChatMessage };
