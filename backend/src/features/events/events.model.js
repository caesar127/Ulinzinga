import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  search: { type: Number, default: 0 },
});

const EventSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    interests: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventCategory" }],
      default: [],
      index: true,
    },
    visible: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isPast: { type: Boolean, default: false },
    isBoosted: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    analytics: {
      type: AnalyticsSchema,
      default: () => ({}),
    },
    bookmarksCount: { type: Number, default: 0 },
    lastSyncedAt: { type: Date, default: null },
    end_date: { type: Date, default: null },
    start_date: { type: Date, default: null },
    merchant: {
      id: String,
      name: String,
      email: String,
    },
    venue: {
      name: { type: String, default: null },
      address: { type: String, default: null },
      location: { type: String, default: null },
    },
    balance: {
      currency: String,
      ref_id: String,
    },
    tags: { type: [String], default: [], index: true },
    description: { type: String, default: null },
    banner_url: { type: String, default: null },
    logo_url: { type: String, default: null },
    title: { type: String, default: null },
    terms_text: { type: String, default: null },
    start_time: { type: String, default: null },
    end_time: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({
  title: "text",
  description: "text",
  "venue.name": "text",
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
