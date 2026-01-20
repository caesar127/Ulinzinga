import mongoose from "mongoose";
import WalletSchema from "../wallet/wallet.model.js";
const { Schema, model } = mongoose;

const GeoSchema = new Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], required: true },
});

const ProfileSchema = new Schema({
  phone: String,
  picture: String,
  bio: String,
  business: {
    reference: String,
    name: String,
    live: Boolean,
  },
  balances: [{
    ref_id: String,
    currency: String,
    currency_name: String,
  }],
});

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    authProvider: {
      type: String,
      enum: ["paychangu", "local", "google"],
      default: "local",
    },
    changuId: String,
    googleId: String,
    reference: String,
    name: String,
    role: {
      type: String,
      enum: ["user", "admin", "organizer", "vendor"],
      default: "user",
    },
    profile: ProfileSchema,
    location: { type: GeoSchema, index: "2dsphere" },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    favoriteEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    interests: [{ type: Schema.Types.ObjectId, ref: "EventCategory" }],
    favoriteOrganizers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
    lastLogin: Date,
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.index({
  name: "text",
  username: "text",
  "profile.bio": "text",
});

export default model("User", UserSchema);
