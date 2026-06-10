const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const pcRoutes = require("./pc.routes");
const sessionRoutes = require("./session.routes");
const customerRoutes = require("./customer.routes");
const customersRoutes = require("./customers.routes");
const cafeRoutes = require("./cafe.routes");

const router = express.Router();
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/auth/client", customerRoutes);
router.use("/admin", adminRoutes);
router.use("/pcs", pcRoutes);
router.use("/sessions", sessionRoutes);
router.use("/customers", customersRoutes);
router.use("/cafe", cafeRoutes);

module.exports = router;
