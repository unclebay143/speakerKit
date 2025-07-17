import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
      required: true 
  },
  // planId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Plan"
  // },
  amount: { 
    type: Number, 
    required: true 
},
  reference: { 
    type: String, 
    required: true, 
    unique: true 
},
  // planName: { 
  //   type: String, 
  //   required: true 
  // },
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
  // isSubscription: {
  //   type: Boolean,
  //   default: false
  // },
  //  subscriptionCode: String,
createdAt: { 
  type: Date, 
  default: Date.now 
}
});

const Transaction = models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;