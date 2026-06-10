const Customer = require("../models/Customer");
const Session = require("../models/Session");

exports.getMe = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user._id).select(
      "-passwordHash",
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};
