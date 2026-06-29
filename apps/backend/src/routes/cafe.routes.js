const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { getCafe, updateCafe } = require("../controllers/cafeController");

const router = express.Router();
router.get("/", requireAuth, requireRole(["owner", "admin", "staff"]), getCafe);
router.put("/", requireAuth, requireRole(["owner", "admin"]), updateCafe);

module.exports = router;
