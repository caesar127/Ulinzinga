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
    enum: ["ticket_inclusive", "ticket_exclusive"],
    required: true,
  },
  event_slug: { type: String },
  ticketTypeId: { type: String },
  ticketType: {
    id: { type: String },
    name: { type: String },
    price: { type: Number },
  },
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
