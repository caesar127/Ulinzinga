import mongoose from "mongoose";

const ticketPackageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  eventId: {
    type: String,
    required: true,
    index: true,
  },
  packageId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "MWK",
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
  rawPaychanguData: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

ticketPackageSchema.index({ eventId: 1, packageId: 1 }, { unique: true });

ticketPackageSchema.methods.isSoldOut = function() {
  return this.availableQuantity <= 0;
};

ticketPackageSchema.methods.decrementAvailability = function(quantity) {
  if (this.availableQuantity < quantity) {
    throw new Error(`Not enough tickets available. Only ${this.availableQuantity} left.`);
  }
  this.availableQuantity -= quantity;
  return this.save();
};

ticketPackageSchema.methods.incrementAvailability = function(quantity) {
  this.availableQuantity += quantity;
  if (this.availableQuantity > this.totalQuantity) {
    this.availableQuantity = this.totalQuantity;
  }
  return this.save();
};

const TicketPackage = mongoose.model('TicketPackage', ticketPackageSchema);

export default TicketPackage;