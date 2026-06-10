const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { getDashboardSummary } = require("../controllers/adminController");

const router = express.Router();
router.get(
  "/dashboard",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  getDashboardSummary,
);

module.exports = router;
