import { Schema, model, models } from "mongoose";

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "NGN"
  },
  interval: {
    type: String,
    enum: ["one-time", "daily", "weekly", "monthly", "quarterly", "yearly"],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isLifetime: {
    type: Boolean,
    default: false
  },
  lifetimeSlots: {
    type: Number,
    default: 0
  },
  features: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Plan = models.Plan || model("Plan", PlanSchema);

export default Plan;