const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    invoiceNo: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    items: [
      {
        label: String,
        qty: Number,
        price: Number,
        total: Number,
      },
    ],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "paid",
    },
    pdfUrl: { type: String, default: "" },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
