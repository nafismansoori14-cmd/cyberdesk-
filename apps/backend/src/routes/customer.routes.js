const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  signup,
  login,
  qrLogin,
} = require("../controllers/customerAuthController");
const {
  getMe,
  getMySessions,
} = require("../controllers/customerProfileController");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/qr-login", qrLogin);
router.get("/me", requireAuth, requireRole(["customer"]), getMe);
router.get(
  "/me/sessions",
  requireAuth,
  requireRole(["customer"]),
  getMySessions,
);

module.exports = router;
