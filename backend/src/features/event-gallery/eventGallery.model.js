import mongoose from "mongoose";

const GalleryAnalyticsSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const EventGallerySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    visibilityScope: {
      type: String,
      enum: ["event", "profile", "vault"],
      required: true,
      index: true,
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },

    analytics: {
      type: GalleryAnalyticsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

EventGallerySchema.pre("validate", function (next) {
  if (this.visibilityScope === "vault") {
    this.privacy = "private";
    this.approvalStatus = "approved";
    this.event = null;
    this.approvedBy = null;
    this.approvedAt = null;
  }

  if (this.visibilityScope === "profile") {
    this.approvalStatus = "approved";
    this.approvedBy = null;
    this.approvedAt = null;
  }

  if (this.visibilityScope === "event" && !this.event) {
    return next(new Error("Event gallery items must reference an event"));
  }

  next();
});

EventGallerySchema.index({
  event: 1,
  visibilityScope: 1,
  privacy: 1,
  approvalStatus: 1,
});

EventGallerySchema.index({
  user: 1,
  visibilityScope: 1,
  createdAt: -1,
});

const EventGallery = mongoose.model("EventGallery", EventGallerySchema);

export default EventGallery;
