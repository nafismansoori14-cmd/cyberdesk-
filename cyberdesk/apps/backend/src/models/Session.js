const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    pcId: { type: mongoose.Schema.Types.ObjectId, ref: "PC", required: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    pricingType: {
      type: String,
      enum: ["normal", "gaming", "night", "happyhour"],
      default: "normal",
    },
    ratePerMinute: { type: Number, required: true },
    pauses: [
      {
        from: Date,
        to: Date,
      },
    ],
    totalPausedMs: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "terminated"],
      default: "active",
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "cash", "upi", "card"],
      default: "wallet",
    },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", sessionSchema);
