import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
      required: true 
  },
  
  amount: { 
    type: Number, 
    required: true 
  },
  reference: { 
    type: String, 
    required: true, 
    unique: true 
  },
  plan: { 
    type: String, 
    enum: ["pro", "lifetime"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },
  currency: { 
    type: String, 
    default: "NGN" 
  },
 
  paystackData: {
  type: Schema.Types.Mixed
  },
   isDiscount: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;