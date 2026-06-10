import { model, models, Schema } from "mongoose";

const assistantContextSchema = new Schema(
  {
    contextKey: {
      type: String,
      required: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
      default: "",
    },
    refinementPrompt: {
      type: String,
      default: "",
    },
    summaryVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export const AssistantContext = models.AssistantContext || model("AssistantContext", assistantContextSchema);