import mongoose from "mongoose";

const EventCategorySchema = new mongoose.Schema(
  {
    categoryId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    color: { type: String, default: "#3b82f6" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EventCategory = mongoose.model("EventCategory", EventCategorySchema);

export default EventCategory;
