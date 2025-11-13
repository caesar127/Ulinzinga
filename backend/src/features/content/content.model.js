import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    media: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["Announcement", "Recap", "Interview", "Highlight", "Other"],
      default: "Other",
    },
    type: {
      type: String,
      enum: ["image", "video", "announcement"],
      default: "image",
    },
    tags: {
      type: [String],
      default: [],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    is_published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ContentSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default mongoose.model("Content", ContentSchema);
