import mongoose from "mongoose";

// Sub-schema for venue location coordinates (geospatial queries)
const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: false,
  },
});

// Venue schema
const VenueSchema = new mongoose.Schema({
  name: { type: String, default: null },
  address: { type: String, default: null },
  location: { type: String, default: null },
  geo: { type: GeoSchema },
});

// Balance schema
const BalanceSchema = new mongoose.Schema({
  currency: { type: String, required: true },
  symbol: { type: String, required: true },
});

// Main Event schema
const EventSchema = new mongoose.Schema(
  {
    // Fields from API
    eventId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: null },
    banner_url: { type: String, default: null },
    logo_url: { type: String, default: null },
    color: { type: String, default: "#ffffff" },
    terms_text: { type: String, default: null },
    start_date: { type: Date, required: true, index: true },
    end_date: { type: Date, required: true },
    start_time: { type: String, default: null },
    end_time: { type: String, default: null },
    is_past: { type: Boolean, default: false },
    merchantName: { type: String, required: true, index: true },
    venue: { type: VenueSchema, required: true },
    balance: { type: BalanceSchema, required: true },
    is_active: { type: Boolean, default: true, index: true },

    // Enhanced fields for backend features
    category: { type: String, default: null },
    interests: { type: [String], default: [] },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    source: {
      type: String,
      enum: ["internal", "external"],
      default: "external",
    },
    externalId: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// **Geospatial index for venue coordinates**
EventSchema.index({ "venue.geo": "2dsphere" });

// Virtual: event duration
EventSchema.virtual("duration").get(function () {
  if (!this.start_date || !this.end_date) return null;
  const durationMs = this.end_date - this.start_date;
  return Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + " days";
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
