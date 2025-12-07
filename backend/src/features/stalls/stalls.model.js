import mongoose from "mongoose";

const StallTypeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"],
    default: "medium",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  electricity: {
    type: Boolean,
    default: false,
  },
  available_count: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

const StallSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stall_types: [StallTypeSchema],
    bookings: [
      {
        stall_type: String,
        quantity: Number,
        vendor_name: String,
        vendor_email: String,
        vendor_phone: String,
        business_name: String,
        booking_date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "cancelled"],
          default: "pending",
        },
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stall = mongoose.model("Stall", StallSchema);

export default Stall;