import mongoose, { Schema } from "mongoose";

const pollSchema = new Schema({
  meetingCode: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  votes: [
    {
      userId: { type: String }, // or socketId if not authenticated
      optionIndex: { type: Number, required: true },
    },
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Poll = mongoose.model("Poll", pollSchema);

export { Poll };
