const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  listPCs,
  createPC,
  updatePC,
  setStatus,
} = require("../controllers/pcController");

const router = express.Router();
router.get("/", requireAuth, requireRole(["owner", "admin", "staff"]), listPCs);
router.post("/", requireAuth, requireRole(["owner", "admin"]), createPC);
router.put("/:id", requireAuth, requireRole(["owner", "admin"]), updatePC);
router.post(
  "/:id/status",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  setStatus,
);

module.exports = router;
