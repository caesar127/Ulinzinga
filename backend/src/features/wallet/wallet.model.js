import mongoose from "mongoose";
const { Schema } = mongoose;



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

  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
