import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  meetingCode: { type: String, required: true, unique: true },
  topic: { type: String, default: "Untitled Meeting" },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scheduledTime: Date,
  password: String,
  isLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  participants: [{ type: String }],
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
