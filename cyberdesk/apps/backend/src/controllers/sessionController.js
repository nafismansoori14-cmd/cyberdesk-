const Joi = require("joi");
const PC = require("../models/PC");
const Session = require("../models/Session");
const Customer = require("../models/Customer");

const pricingRates = {
  normal: 0.5,
  gaming: 0.83,
  night: 0.33,
  happyhour: 0.4,
};

const startSchema = Joi.object({
  pcId: Joi.string().required(),
  customerId: Joi.string().required(),
  pricingType: Joi.string()
    .valid("normal", "gaming", "night", "happyhour")
    .required(),
  paymentMethod: Joi.string()
    .valid("wallet", "cash", "upi", "card")
    .default("wallet"),
});

exports.listSessions = async (req, res, next) => {
  try {
    const cafeId = req.user.cafeId;
    const sessions = await Session.find({ cafeId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

exports.getActiveSessions = async (req, res, next) => {
  try {
    const cafeId = req.user.cafeId;
    const sessions = await Session.find({ cafeId, status: "active" });
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      cafeId: req.user.cafeId,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (err) {
    next(err);
  }
};

exports.startSession = async (req, res, next) => {
  try {
    const { error, value } = startSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const pc = await PC.findOne({ _id: value.pcId, cafeId: req.user.cafeId });
    if (!pc || pc.status !== "free") {
      return res.status(400).json({ message: "PC unavailable or not free" });
    }

    const customer = await Customer.findOne({
      _id: value.customerId,
      cafeId: req.user.cafeId,
    });
    if (!customer || customer.isBlocked) {
      return res.status(400).json({ message: "Customer invalid or blocked" });
    }

    const ratePerMinute =
      pricingRates[value.pricingType] || pricingRates.normal;
    const session = await Session.create({
      cafeId: req.user.cafeId,
      pcId: pc._id,
      customerId: customer._id,
      customerName: customer.name,
      pricingType: value.pricingType,
      ratePerMinute,
      paymentMethod: value.paymentMethod,
    });

    pc.status = "active";
    pc.currentSessionId = session._id;
    await pc.save();

    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
};

exports.pauseSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      cafeId: req.user.cafeId,
      status: "active",
    });
    if (!session)
      return res.status(404).json({ message: "Active session not found" });

    session.status = "paused";
    session.pauses.push({ from: new Date() });
    await session.save();
    res.json({ session });
  } catch (err) {
    next(err);
  }
};

exports.resumeSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      cafeId: req.user.cafeId,
      status: "paused",
    });
    if (!session)
      return res.status(404).json({ message: "Paused session not found" });

    const lastPause = session.pauses[session.pauses.length - 1];
    if (lastPause && !lastPause.to) {
      lastPause.to = new Date();
      session.totalPausedMs += lastPause.to - lastPause.from;
    }
    session.status = "active";
    await session.save();
    res.json({ session });
  } catch (err) {
    next(err);
  }
};

exports.stopSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      cafeId: req.user.cafeId,
      status: { $in: ["active", "paused"] },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const now = new Date();
    if (session.status === "paused" && session.pauses.length) {
      const lastPause = session.pauses[session.pauses.length - 1];
      if (lastPause && !lastPause.to) {
        lastPause.to = now;
        session.totalPausedMs += now - lastPause.from;
      }
    }

    session.endTime = now;
    session.durationMinutes = Math.max(
      1,
      Math.ceil((now - session.startTime - session.totalPausedMs) / 60000),
    );
    session.amount = parseFloat(
      (session.durationMinutes * session.ratePerMinute).toFixed(2),
    );
    session.status = "completed";

    await session.save();
    await PC.findOneAndUpdate(
      { _id: session.pcId, cafeId: req.user.cafeId },
      { status: "free", currentSessionId: null },
    );
    await Customer.findByIdAndUpdate(session.customerId, {
      $inc: { totalSpent: session.amount, sessionsCount: 1 },
    });

    res.json({ session });
  } catch (err) {
    next(err);
  }
};
