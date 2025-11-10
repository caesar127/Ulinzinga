import mongoose from "mongoose";

const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true,
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "organizer", "vendor"], // added vendor
      default: "user",
    },
    interests: {
      type: [String],
      default: [],
    },
    location: {
      type: GeoSchema,
      index: "2dsphere",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    notifications: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
