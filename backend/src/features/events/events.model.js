import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  name: { type: String, default: null },
  address: { type: String, default: null },
  location: { type: String, default: null },
});

const BalanceSchema = new mongoose.Schema({
  currency: { type: String, required: true },
  symbol: { type: String, required: true },
});

const EventSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// Optional: Add virtuals for formatted dates or computed fields
EventSchema.virtual("duration").get(function () {
  if (!this.start_date || !this.end_date) return null;
  const durationMs = this.end_date - this.start_date;
  return Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + " days";
});

const Event = mongoose.model("Event", EventSchema);

export default Event;