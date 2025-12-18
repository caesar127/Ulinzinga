import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  
  paychanguTicketId: {
    type: String,
    required: true,
    unique: true,
  },
  paychanguEventId: {
    type: String,
    required: true,
  },

  ticketType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
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
  
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
  },
  
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentReference: {
    type: String,
  },
  
  isRedeemed: {
    type: Boolean,
    default: false,
  },
  redeemedAt: {
    type: Date,
  },
  redeemedBy: {
    type: String,
  },
  
  qrCodeUuid: {
    type: String,
    unique: true,
  },
  qrCodeData: {
    type: String
  },
  
  isGift: {
    type: Boolean,
    default: false,
  },
  giftRecipientName: {
    type: String,
  },
  giftRecipientEmail: {
    type: String,
  },
  giftMessage: {
    type: String,
  },
  giftedBy: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
  
  rawPaychanguData: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

ticketSchema.index({ paychanguEventId: 1 });
ticketSchema.index({ customerEmail: 1 });
ticketSchema.index({ isRedeemed: 1 });
ticketSchema.index({ qrCodeUuid: 1 });
ticketSchema.index({ paymentStatus: 1 });
ticketSchema.index({ purchaseDate: -1 });

ticketSchema.virtual('status').get(function() {
  if (this.paymentStatus !== 'paid') {
    return this.paymentStatus;
  }
  return this.isRedeemed ? 'redeemed' : 'valid';
});

ticketSchema.methods.markAsRedeemed = function(staffMember) {
  this.isRedeemed = true;
  this.redeemedAt = new Date();
  this.redeemedBy = staffMember;
  return this.save();
};

ticketSchema.methods.markAsUnredeemed = function() {
  this.isRedeemed = false;
  this.redeemedAt = undefined;
  this.redeemedBy = undefined;
  return this.save();
};

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;