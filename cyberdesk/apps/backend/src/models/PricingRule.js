const mongoose = require("mongoose");

const pricingRuleSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["normal", "gaming", "night", "happyhour", "custom"],
      default: "normal",
    },
    ratePerMinute: { type: Number, required: true },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    startHour: { type: Number, min: 0, max: 24, default: 0 },
    endHour: { type: Number, min: 0, max: 24, default: 24 },
    minDuration: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PricingRule", pricingRuleSchema);
