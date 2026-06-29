const mongoose = require("mongoose");

const pcSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    label: { type: String, required: true },
    specs: {
      cpu: String,
      gpu: String,
      ram: String,
      monitor: String,
    },
    status: {
      type: String,
      enum: ["active", "free", "locked", "maintenance", "offline"],
      default: "free",
    },
    agentId: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    currentSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    position: {
      row: { type: Number, default: 0 },
      col: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PC", pcSchema);
