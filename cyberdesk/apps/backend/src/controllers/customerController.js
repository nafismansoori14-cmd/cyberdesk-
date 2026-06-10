const Customer = require("../models/Customer");

exports.listCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ cafeId: req.user.cafeId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ customers });
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      cafeId: req.user.cafeId,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.blockCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, cafeId: req.user.cafeId },
      { isBlocked: true },
      { new: true },
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};

exports.unblockCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, cafeId: req.user.cafeId },
      { isBlocked: false },
      { new: true },
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};
