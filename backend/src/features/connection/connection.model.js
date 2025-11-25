import mongoose, { Schema } from "mongoose";

const ConnectionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    connection: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ConnectionSchema.index({ user: 1, connection: 1 }, { unique: true });

export default mongoose.model("Connection", ConnectionSchema);
