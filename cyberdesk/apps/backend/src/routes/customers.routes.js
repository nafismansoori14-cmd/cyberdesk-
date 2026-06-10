const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  listCustomers,
  getCustomer,
  blockCustomer,
  unblockCustomer,
} = require("../controllers/customerController");

const router = express.Router();
router.get(
  "/",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  listCustomers,
);
router.get(
  "/:id",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  getCustomer,
);
router.post(
  "/:id/block",
  requireAuth,
  requireRole(["owner", "admin"]),
  blockCustomer,
);
router.post(
  "/:id/unblock",
  requireAuth,
  requireRole(["owner", "admin"]),
  unblockCustomer,
);

module.exports = router;
