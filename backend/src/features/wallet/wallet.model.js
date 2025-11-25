import mongoose from "mongoose";
const { Schema } = mongoose;

const WalletSchema = new Schema({
  balances: [
    {
      currency: { type: String, required: true },
      amount: { type: Number, default: 0 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default WalletSchema;
