import mongoose from "mongoose";
const { Schema } = mongoose;

const SavingsGoalSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  targetDate: { type: Date },
  savingType: {
    type: String,
    enum: ["ticket_inclusive", "ticket_exclusive", "event_spending", "complete_event", "organizer"],
    required: true,
  },
  event_slug: { type: String },
  ticketTypeId: { type: String },
  ticketType: {
    id: { type: String },
    name: { type: String },
    price: { type: Number },
  },
  ticketQuantity: { type: Number, default: 1, min: 1 },
  additionalSpending: { type: Number, default: 0 },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  organizerName: { type: String },
  cutoffDate: { type: Date },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium"
  },
  reminderDays: { type: Number, default: 3 },
  isAutoPurchase: { type: Boolean, default: false },
  allocations: [{
    event_slug: { type: String },
    event_title: { type: String },
    allocatedAmount: { type: Number },
    allocatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" }
  }],
});

const WalletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    regularBalance: { type: Number, default: 0 },
    savingsBalance: { type: Number, default: 0 },
    currency: { type: String, default: "MWK", immutable: true },
    paychanguAccountId: { type: String },
    savingsGoals: [SavingsGoalSchema],
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
