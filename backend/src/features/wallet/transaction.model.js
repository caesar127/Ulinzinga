import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    subtype: {
      type: String,
      enum: [
        "deposit", // Money deposited from external source
        "transfer_in", // Money received from another user
        "transfer_out", // Money sent to another user
        "savings_deposit", // Money moved to savings
        "savings_withdraw", // Money withdrawn from savings
        "event_payment", // Payment for event
        "refund", // Money refunded
        "withdrawal", // Money withdrawn to external account
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    toAccountType: {
      type: String,
      enum: ["user", "organizer", "vendor"],
    },
    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // For savings transactions
    savingsGoalId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // PayChangu integration
    tx_ref: {
      type: String,
      unique: true,
      sparse: true,
    },
    paychanguTransactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
