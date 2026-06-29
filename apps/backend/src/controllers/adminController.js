const Session = require("../models/Session");
const PC = require("../models/PC");
const Customer = require("../models/Customer");

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const cafeId = req.user.cafeId;
    const activeSessions = await Session.countDocuments({
      cafeId,
      status: "active",
    });
    const totalPCs = await PC.countDocuments({ cafeId });
    const customerCount = await Customer.countDocuments({ cafeId });

    res.json({
      activeSessions,
      totalPCs,
      customerCount,
    });
  } catch (err) {
    next(err);
  }
};
