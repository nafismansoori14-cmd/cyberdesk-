const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  listSessions,
  getActiveSessions,
  getSessionById,
  startSession,
  pauseSession,
  resumeSession,
  stopSession,
} = require("../controllers/sessionController");

const router = express.Router();
router.get(
  "/",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  listSessions,
);
router.get(
  "/active",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  getActiveSessions,
);
router.get(
  "/:id",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  getSessionById,
);
router.post(
  "/start",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  startSession,
);
router.post(
  "/:id/pause",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  pauseSession,
);
router.post(
  "/:id/resume",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  resumeSession,
);
router.post(
  "/:id/stop",
  requireAuth,
  requireRole(["owner", "admin", "staff"]),
  stopSession,
);

module.exports = router;
