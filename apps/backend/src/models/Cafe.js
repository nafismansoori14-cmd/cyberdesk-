const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    licenseKey: { type: String, default: "" },
    licenseExpiresAt: { type: Date },
    plan: {
      type: String,
      enum: ["starter", "pro", "enterprise"],
      default: "starter",
    },
    settings: {
      autoStopOnZeroBalance: { type: Boolean, default: true },
      soundAlerts: { type: Boolean, default: true },
      theme: { type: String, enum: ["dark", "light", "auto"], default: "dark" },
      taxPercent: { type: Number, default: 18 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cafe", cafeSchema);
