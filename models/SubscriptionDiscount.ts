import { Schema, model, models } from "mongoose";

const SubscriptionDiscountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ["1-year"],
    default: "1-year"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  usedAt: {
    type: Date
  }
});

const SubscriptionDiscount =  models.SubscriptionDiscount || model("SubscriptionDiscount", SubscriptionDiscountSchema);

export default SubscriptionDiscount;