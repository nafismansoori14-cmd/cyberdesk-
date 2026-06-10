const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String },
    type: { type: String, enum: ["walk-in", "registered"], default: "walk-in" },
    wallet: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    sessionsCount: { type: Number, default: 0 },
    qrToken: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String, default: "" },
    membership: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    loyaltyPoints: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
