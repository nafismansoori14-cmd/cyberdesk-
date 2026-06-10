const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");

exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let account;

    if (decoded.role === "customer") {
      account = await Customer.findById(decoded.userId).select("-passwordHash");
      if (!account || account.isBlocked) {
        return res
          .status(401)
          .json({ message: "Invalid customer credentials" });
      }
      account.role = "customer";
    } else {
      account = await User.findById(decoded.userId).select("-passwordHash");
      if (!account || !account.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    req.user = account;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
