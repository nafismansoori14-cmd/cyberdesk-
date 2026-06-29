const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
    },
    plan: {
      type: String,
      enum: ["starter", "pro", "enterprise"],
      default: "starter",
    },
    maxPCs: { type: Number, default: 20 },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("License", licenseSchema);
