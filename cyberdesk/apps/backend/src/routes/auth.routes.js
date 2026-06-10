const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logout,
  getMe,
} = require("../controllers/authController");

const router = express.Router();
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

module.exports = router;
